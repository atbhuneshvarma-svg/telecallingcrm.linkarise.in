import React, { useEffect, useState } from 'react';
import CampaignModal from './CampaignModal';
import CampaignList from './CampaignList';
import {
  getCampaigns,
  addCampaign,
  updateCampaign,
  deleteCampaign,
  Campaign,
} from './core/_request';

interface PaginationInfo {
  current_page: number;
  per_page: number;
  total_records: number;
  total_pages: number;
}

const Campaigns = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [pagination, setPagination] = useState<PaginationInfo>({
    current_page: 1,
    per_page: 10,
    total_records: 0,
    total_pages: 1,
  });

  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [searchTerm, setSearchTerm] = useState('');
  const [campaignDate, setCampaignDate] = useState('');
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [currentCampaignName, setCurrentCampaignName] = useState('');
  const [editCampaignId, setEditCampaignId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch campaigns when page, entries per page, or search term changes
  useEffect(() => {
    fetchCampaigns();
  }, [currentPage, entriesPerPage, searchTerm]);

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      console.log(
        'Fetching campaigns with page:',
        currentPage,
        'per page:',
        entriesPerPage,
        'search:',
        searchTerm
      );
      const response = await getCampaigns(currentPage, entriesPerPage, searchTerm);
      console.log('Campaigns API response:', response);

      setCampaigns(response.data);
      setPagination({
        current_page: response.current_page,
        per_page: response.per_page,
        total_records: response.total_records,
        total_pages: response.total_pages,
      });
    } catch (error: any) {
      console.error('Error fetching campaigns:', error);
      setCampaigns([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEntriesChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newPerPage = Number(e.target.value);
    setEntriesPerPage(newPerPage);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const formatDate = (dateStr: string) => {
    // Convert from YYYY-MM-DD (input format) to DD-MM-YYYY (backend format)
    const [year, month, day] = dateStr.split('-');
    return `${day}-${month}-${year}`;
  };

  const handleAddOrUpdateCampaign = async () => {
    if (!currentCampaignName.trim()) {
      alert('Please enter a campaign name');
      return;
    }

    if (!campaignDate) {
      alert('Please select a date');
      return;
    }

    // Format the date to DD-MM-YYYY for the backend
    const formattedDate = formatDate(campaignDate);
    console.log('Date conversion:', {
      input: campaignDate,
      output: formattedDate,
    });

    try {
      if (modalMode === 'add') {
        console.log('Adding campaign:', { name: currentCampaignName, date: formattedDate });
        await addCampaign(currentCampaignName, formattedDate);
      } else if (modalMode === 'edit' && editCampaignId !== null) {
        console.log('Updating campaign:', {
          id: editCampaignId,
          name: currentCampaignName,
          date: formattedDate,
        });
        await updateCampaign(editCampaignId, currentCampaignName, formattedDate);
      }
      await fetchCampaigns();
    } catch (error: any) {
      console.error('Error saving campaign:', error);

      let errorMessage = 'Error saving campaign. Please try again.';
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }

      alert(errorMessage);
      return;
    }

    setCurrentCampaignName('');
    setEditCampaignId(null);
    setCampaignDate('');
    setShowModal(false);
  };

  const handleDeleteCampaign = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this campaign?')) return;

    try {
      console.log('Deleting campaign:', id);
      await deleteCampaign(id);

      // Always refresh to ensure data consistency
      await fetchCampaigns();

      // If current page becomes empty after deletion, go to previous page
      if (campaigns.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    } catch (error: any) {
      console.error('Error deleting campaign:', error);

      let errorMessage = 'Error deleting campaign. Please try again.';
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }

      alert(errorMessage);
    }
  };

  const handleEditCampaign = (campaign: Campaign) => {
    setModalMode('edit');
    setEditCampaignId(campaign.id);
    setCurrentCampaignName(campaign.name);
    setCampaignDate(campaign.date);
    setShowModal(true);
  };

  const handleAddNew = () => {
    setModalMode('add');
    setCurrentCampaignName('');
    setCampaignDate('');
    setEditCampaignId(null);
    setShowModal(true);
  };

  // Handle search with debounce
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Remove client-side filtering since we're using server-side search
  const displayedCampaigns = campaigns;

  return (
    <div className="container-fluid py-4">
      {/* Main Card */}
      <div className="card shadow-sm">
        {/* Card Header */}
        <div className="card-header bg-transparent py-3">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="fw-bold text-gray-800">Campaign Master</h1>
            </div>
          </div>
          <button
            onClick={handleAddNew}
            className="btn btn-sm btn-primary d-flex align-items-center gap-2 mt-1"
            style={{width:'150px' , height:'35px'}}
          >
            <i className="bi bi-plus-circle"></i>
            Add Campaign
          </button>
        </div>

        {/* Card Body */}
        <div className="card-body">
          {/* Controls Card */}
          <div className="card card-flat mb-4">
            <div className="card-body py-3">
              <div className="row align-items-center">
                <div className="col-md-6">
                  <div className="d-flex align-items-center gap-2">
                    <label className="form-label mb-0 text-muted">Show</label>
                    <select
                      value={entriesPerPage}
                      onChange={handleEntriesChange}
                      className="form-select form-select-sm w-auto"
                    >
                      <option value="5">5</option>
                      <option value="10">10</option>
                      <option value="25">25</option>
                      <option value="50">50</option>
                    </select>
                    <label className="form-label mb-0 text-muted">entries</label>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="d-flex align-items-center gap-2 justify-content-md-end">
                    <label className="form-label mb-0 text-muted">Search:</label>
                    <div className="position-relative">
                      <input
                        type="text"
                        placeholder="Search campaigns..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="form-control form-control-sm"
                      />
                      <i className="bi bi-search position-absolute top-50 end-0 translate-middle-y me-2 text-muted"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Campaign List Card */}
          <div className="card">
            <div className="card-body p-0">
              <CampaignList
                campaigns={displayedCampaigns}
                onEdit={handleEditCampaign}
                onDelete={handleDeleteCampaign}
                loading={loading}
              />
            </div>
          </div>

          {/* Footer Card */}
          <div className="card card-flat mt-4">
            <div className="card-body py-3">
              <div className="d-flex justify-content-between align-items-center">
                <div className="text-muted small">
                  Showing {displayedCampaigns.length} of {pagination.total_records} entries
                  {searchTerm && ` (filtered from ${pagination.total_records} total entries)`}
                </div>

                {/* Pagination Controls */}
                {pagination.total_pages > 1 && (
                  <div className="d-flex align-items-center gap-3">
                    <div className="text-muted small">
                      Page {pagination.current_page} of {pagination.total_pages}
                    </div>
                    <nav>
                      <ul className="pagination pagination-sm mb-0">
                        <li
                          className={`page-item ${pagination.current_page === 1 ? 'disabled' : ''}`}
                        >
                          <button
                            className="page-link"
                            onClick={() => handlePageChange(pagination.current_page - 1)}
                            disabled={pagination.current_page === 1}
                          >
                            Previous
                          </button>
                        </li>

                        {Array.from({ length: pagination.total_pages }, (_, i) => i + 1).map(
                          (page) => (
                            <li
                              key={page}
                              className={`page-item ${pagination.current_page === page ? 'active' : ''
                                }`}
                            >
                              <button className="page-link" onClick={() => handlePageChange(page)}>
                                {page}
                              </button>
                            </li>
                          )
                        )}

                        <li
                          className={`page-item ${pagination.current_page === pagination.total_pages ? 'disabled' : ''
                            }`}
                        >
                          <button
                            className="page-link"
                            onClick={() => handlePageChange(pagination.current_page + 1)}
                            disabled={pagination.current_page === pagination.total_pages}
                          >
                            Next
                          </button>
                        </li>
                      </ul>
                    </nav>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <CampaignModal
        show={showModal}
        onClose={() => setShowModal(false)}
        mode={modalMode}
        campaignName={currentCampaignName}
        setCampaignName={setCurrentCampaignName}
        campaignDate={campaignDate}
        setCampaignDate={setCampaignDate}
        onSubmit={handleAddOrUpdateCampaign}
      />
    </div>
  );
};

export default Campaigns;