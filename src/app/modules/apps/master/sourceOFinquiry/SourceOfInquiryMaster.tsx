// src/app/modules/apps/master/source-of-inquiry/SourceOfInquiryMaster.tsx
import React, { useState, useEffect } from 'react';
import SourceOfInquiryList from './SourceOfInquiryList';
import SourceOfInquiryModal from './SourceOfInquiryModal';
import { sourceOfInquiryApi, SourceOfInquiry, PaginationInfo } from './core/_request';

const SourceOfInquiryMaster: React.FC = () => {
  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [pagination, setPagination] = useState<PaginationInfo>({
    current_page: 1,
    per_page: 10,
    total_records: 0,
    total_pages: 1
  });

  const [allSourceOfInquiries, setAllSourceOfInquiries] = useState<SourceOfInquiry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [currentSourceOfInquiry, setCurrentSourceOfInquiry] = useState<SourceOfInquiry>({ id: 0, name: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load source of inquiries from API when page or entries per page changes
  useEffect(() => {
    loadSourceOfInquiries();
  }, [currentPage, entriesPerPage]);

  const loadSourceOfInquiries = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await sourceOfInquiryApi.getSourceOfInquiriesPaginated(currentPage, entriesPerPage);
      setAllSourceOfInquiries(response.data);
      setPagination({
        current_page: response.current_page,
        per_page: response.per_page,
        total_records: response.total_records,
        total_pages: response.total_pages
      });
    } catch (err) {
      setError('Failed to load source of inquiries. Please try again.');
      console.error('Error loading source of inquiries:', err);
      setAllSourceOfInquiries([]);
    } finally {
      setLoading(false);
    }
  };

  // Handlers
  const handleEntriesChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newPerPage = Number(e.target.value);
    setEntriesPerPage(newPerPage);
    setCurrentPage(1); // Reset to first page when changing entries per page
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleAddOrUpdateSourceOfInquiry = async () => {
    if (!currentSourceOfInquiry.name.trim()) return;

    try {
      setError(null);
      if (modalMode === 'add') {
        await sourceOfInquiryApi.createSourceOfInquiry({
          name: currentSourceOfInquiry.name
        });
      } else {
        await sourceOfInquiryApi.updateSourceOfInquiry(currentSourceOfInquiry.id, {
          name: currentSourceOfInquiry.name
        });
      }

      // Refresh the list to get updated data
      await loadSourceOfInquiries();
      setCurrentSourceOfInquiry({ id: 0, name: '' });
      setShowModal(false);
    } catch (err) {
      const errorMessage = modalMode === 'add'
        ? 'Failed to create source of inquiry. Please try again.'
        : 'Failed to update source of inquiry. Please try again.';
      setError(errorMessage);
      console.error('Error saving source of inquiry:', err);
    }
  };

  const handleEditSourceOfInquiry = (sourceOfInquiry: SourceOfInquiry) => {
    setModalMode('edit');
    setCurrentSourceOfInquiry(sourceOfInquiry);
    setShowModal(true);
  };

  const handleDeleteSourceOfInquiry = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this source of inquiry?')) return;

    try {
      setError(null);
      await sourceOfInquiryApi.deleteSourceOfInquiry(id);
      // Refresh to update data
      await loadSourceOfInquiries();
    } catch (err) {
      setError('Failed to delete source of inquiry. Please try again.');
      console.error('Error deleting source of inquiry:', err);
    }
  };

  const handleAddNew = () => {
    setModalMode('add');
    setCurrentSourceOfInquiry({ id: 0, name: '' });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentSourceOfInquiry({ id: 0, name: '' });
  };

  const handleRetry = () => {
    setError(null);
    loadSourceOfInquiries();
  };

  // Apply search filter to the current page data
  const filteredSourceOfInquiries = allSourceOfInquiries.filter((inquiry) =>
    inquiry.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate display information
  const showingCount = filteredSourceOfInquiries.length;
  const totalCount = pagination.total_records;
  const hasSearchFilter = searchTerm.trim() !== '';

  return (
    <div className="container-fluid">
      {/* Card Container */}
      <div className="card">
        {/* Card Header */}
        <div className="card-header border-0 pt-6">
          <div className="card-title">
            <h1 className="fw-bold text-gray-800">Source of Inquiries</h1>
          </div>

          <div className="card-toolbar">
            <div className="d-flex align-items-center gap-4">
              {/* Search Input */}
              <div className="d-flex align-items-center position-relative">
                <i className="bi bi-search fs-4 position-absolute ms-3"></i>
                <input
                  type="text"
                  className="form-control form-control-solid w-250px ps-10"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Entries Selector */}
              <div className="d-flex align-items-center">
                <span className="text-gray-600 me-2">Show</span>
                <select
                  className="form-select form-select-solid w-auto"
                  value={entriesPerPage}
                  onChange={handleEntriesChange}
                >
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
                <span className="text-gray-600 ms-2">entries</span>
              </div>

              {/* Add Source of Inquiry Button */}
              <button
                onClick={handleAddNew}
                className="btn btn-sm btn-primary d-flex align-items-center gap-2"
           style={{width:'150px' , height:'35px'}}
              >
                <i className="bi bi-plus-circle"></i>
                Add Source
              </button>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="card-body border-bottom">
            <div className="alert alert-danger alert-dismissible fade show mb-0" role="alert">
              <div className="d-flex align-items-center">
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                <div className="flex-grow-1">{error}</div>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setError(null)}
                  aria-label="Close"
                ></button>
              </div>
              <div className="mt-2">
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={handleRetry}
                >
                  <i className="bi bi-arrow-clockwise me-1"></i>
                  Retry
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Card Body */}
        <div className="card-body p-0">
          <SourceOfInquiryList
            sourceOfInquiries={filteredSourceOfInquiries}
            loading={loading}
            currentPage={currentPage}
            perPage={entriesPerPage}
            onEditSourceOfInquiry={handleEditSourceOfInquiry}
            onDeleteSourceOfInquiry={handleDeleteSourceOfInquiry}
          />

        </div>

        {/* Card Footer */}
        <div className="card-footer d-flex justify-content-between align-items-center py-3">
          <div className="text-gray-600">
            {hasSearchFilter ? (
              <>
                Showing {showingCount} of {allSourceOfInquiries.length} entries on this page
                <span className="text-muted"> (from {totalCount} total records)</span>
              </>
            ) : (
              `Showing ${showingCount} of ${totalCount} entries`
            )}
          </div>

          {/* Pagination - Only show if there are multiple pages */}
          {pagination.total_pages > 1 && (
            <nav>
              <ul className="pagination mb-0">
                {/* Previous Button */}
                <li className={`page-item ${pagination.current_page === 1 ? 'disabled' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(pagination.current_page - 1)}
                    disabled={pagination.current_page === 1}
                  >
                    Previous
                  </button>
                </li>

                {/* Page Numbers */}
                {Array.from({ length: pagination.total_pages }, (_, i) => i + 1).map(page => (
                  <li
                    key={page}
                    className={`page-item ${pagination.current_page === page ? 'active' : ''}`}
                  >
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </button>
                  </li>
                ))}

                {/* Next Button */}
                <li className={`page-item ${pagination.current_page === pagination.total_pages ? 'disabled' : ''}`}>
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
          )}
        </div>
      </div>

      {/* Modal */}
      <SourceOfInquiryModal
        show={showModal}
        mode={modalMode}
        sourceOfInquiry={currentSourceOfInquiry}
        onClose={handleCloseModal}
        onSave={handleAddOrUpdateSourceOfInquiry}
        onSourceOfInquiryChange={setCurrentSourceOfInquiry}
      />
    </div>
  );
};

export default SourceOfInquiryMaster;