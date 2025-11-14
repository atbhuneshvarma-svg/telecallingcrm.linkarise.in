// src/app/modules/apps/master/purpose/PurposeMaster.tsx
import React, { useState, useEffect } from 'react';
import PurposeList from './PurposeList';
import PurposeModal from './PurposeModal';
import { purposeApi, Purpose } from './core/_request';

interface PaginationInfo {
  current_page: number;
  per_page: number;
  total_records: number;
  total_pages: number;
}

interface PurposeResponse {
  data: Purpose[];
  current_page: number;
  per_page: number;
  total_records: number;
  total_pages: number;
}

const PurposeMaster: React.FC = () => {
  const [purposes, setPurposes] = useState<Purpose[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationInfo>({
    current_page: 1,
    per_page: 10,
    total_records: 0,
    total_pages: 1
  });
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [currentPurpose, setCurrentPurpose] = useState<Purpose>({ id: 0, name: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load purposes from API when page or entries per page changes
  useEffect(() => {
    loadPurposes();
  }, [currentPage, entriesPerPage]);

  const loadPurposes = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Use server-side pagination - the API already supports it!
      const response = await purposeApi.getPurposesPaginated(currentPage, entriesPerPage);
      
      setPurposes(response.data);
      setPagination({
        current_page: response.current_page,
        per_page: response.per_page,
        total_records: response.total_records,
        total_pages: response.total_pages
      });
      
    } catch (err) {
      setError('Failed to load purposes. Please try again.');
      console.error('Error loading purposes:', err);
      setPurposes([]);
      setPagination({
        current_page: 1,
        per_page: entriesPerPage,
        total_records: 0,
        total_pages: 1
      });
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

  const handleAddOrUpdatePurpose = async () => {
    if (!currentPurpose.name.trim()) return;

    try {
      setError(null);
      if (modalMode === 'add') {
        await purposeApi.createPurpose({
          name: currentPurpose.name
        });
      } else {
        await purposeApi.updatePurpose(currentPurpose.id, {
          name: currentPurpose.name
        });
      }

      setCurrentPurpose({ id: 0, name: '' });
      setShowModal(false);
      // Refresh the list - go to first page for new items
      setCurrentPage(1);
      await loadPurposes();
    } catch (err) {
      const errorMessage = modalMode === 'add'
        ? 'Failed to create purpose. Please try again.'
        : 'Failed to update purpose. Please try again.';
      setError(errorMessage);
      console.error('Error saving purpose:', err);
    }
  };

  const handleEditPurpose = (purpose: Purpose) => {
    setModalMode('edit');
    setCurrentPurpose(purpose);
    setShowModal(true);
  };

  const handleDeletePurpose = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this purpose?')) return;

    try {
      setError(null);
      await purposeApi.deletePurpose(id);
      // Refresh to update the list
      await loadPurposes();
    } catch (err) {
      setError('Failed to delete purpose. Please try again.');
      console.error('Error deleting purpose:', err);
    }
  };

  const handleAddNew = () => {
    setModalMode('add');
    setCurrentPurpose({ id: 0, name: '' });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentPurpose({ id: 0, name: '' });
  };

  const handleRetry = () => {
    setError(null);
    loadPurposes();
  };

  // Client-side filtering for search (only filters current page)
  const filteredPurposes = purposes.filter((purpose) =>
    purpose.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Debug logging
  useEffect(() => {
    console.log('Pagination state:', {
      currentPage,
      entriesPerPage,
      totalPurposes: purposes.length,
      totalFiltered: filteredPurposes.length,
      totalRecords: pagination.total_records,
      totalPages: pagination.total_pages,
      displayedCount: filteredPurposes.length
    });
  }, [currentPage, entriesPerPage, purposes.length, filteredPurposes.length, pagination]);

  if (loading) {
    return (
      <div className="container-fluid py-4">
        <div className="card shadow-sm">
          <div className="card-body">
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
              <div className="text-center">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3 text-muted">Loading purposes...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      {/* Main Card */}
      <div className="card shadow-sm">
        {/* Card Header - Fixed Layout */}
        <div className="card-header bg-transparent py-3">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="h4 fw-bold mb-1">Purpose Master</h1>
              
            </div>
            
          </div>
          <button
              onClick={handleAddNew}
              className="btn btn-primary d-flex align-items-center gap-2"
            >
              <i className="bi bi-plus-circle"></i>
              Add Purpose
            </button>
        </div>

        {/* Card Body */}
        <div className="card-body">
          {/* Error Alert */}
          {error && (
            <div className="alert alert-danger alert-dismissible fade show mb-4" role="alert">
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
          )}

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
                        placeholder="Search purposes..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="form-control form-control-sm"
                      />
                      <i className="bi bi-search position-absolute top-50 end-0 translate-middle-y me-2 text-muted"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Purpose List Card */}
          <div className="card">
            <div className="card-body p-0">
              <PurposeList
                purposes={filteredPurposes}
                onEdit={handleEditPurpose}
                onDelete={handleDeletePurpose}
                loading={loading}
              />
            </div>
          </div>

          {/* Footer Card */}
          <div className="card card-flat mt-4">
            <div className="card-body py-3">
              <div className="d-flex justify-content-between align-items-center">
                <div className="text-muted small">
                  Showing {filteredPurposes.length} of {pagination.total_records} entries
                  {searchTerm && filteredPurposes.length < purposes.length && 
                    ` (filtered from ${purposes.length} entries on this page)`
                  }
                </div>

                {/* Pagination Controls - Use server-side pagination info */}
                {pagination.total_pages > 1 && (
                  <div className="d-flex align-items-center gap-3">
                    <div className="text-muted small">
                      Page {pagination.current_page} of {pagination.total_pages}
                    </div>
                    <nav>
                      <ul className="pagination pagination-sm mb-0">
                        <li className={`page-item ${pagination.current_page === 1 ? 'disabled' : ''}`}>
                          <button
                            className="page-link"
                            onClick={() => handlePageChange(pagination.current_page - 1)}
                            disabled={pagination.current_page === 1}
                          >
                            Previous
                          </button>
                        </li>

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
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <PurposeModal
        show={showModal}
        mode={modalMode}
        purpose={currentPurpose}
        onClose={handleCloseModal}
        onSave={handleAddOrUpdatePurpose}
        onPurposeChange={setCurrentPurpose}
      />
    </div>
  );
};

export default PurposeMaster;