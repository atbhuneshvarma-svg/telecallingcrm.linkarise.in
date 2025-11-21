// StatusMaster.tsx - Updated with comprehensive debugging
import React, { useState, useEffect } from 'react';
import StatusList from './StatusList';
import StatusModal from './StatusModal';
import { statusApi, Status, PaginationInfo } from './core/_request';

const StatusMaster: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [pagination, setPagination] = useState<PaginationInfo>({
    current_page: 1,
    per_page: 10,
    total_records: 0,
    total_pages: 1,
  });

  const [statuses, setStatuses] = useState<Status[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [currentStatus, setCurrentStatus] = useState<Status>({
    id: 0,
    name: '',
    color: '#0d6efd',
    stage: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('🔄 StatusMaster: useEffect triggered', { currentPage, entriesPerPage });
    loadStatuses();
  }, [currentPage, entriesPerPage]);

  const loadStatuses = async () => {
    try {
      console.log('🔄 StatusMaster: Loading statuses...');
      setLoading(true);
      setError(null);
      
      const response = await statusApi.getStatusesPaginated(currentPage, entriesPerPage);
      console.log('✅ StatusMaster: API Response received', { 
        dataLength: response.data.length,
        current_page: response.current_page,
        total_records: response.total_records,
        total_pages: response.total_pages
      });
      
      setStatuses(response.data);
      setPagination({
        current_page: response.current_page,
        per_page: response.per_page,
        total_records: response.total_records,
        total_pages: response.total_pages,
      });
      
      console.log('✅ StatusMaster: State updated successfully');
    } catch (err) {
      console.error('❌ StatusMaster: Error loading statuses:', err);
      setError('Failed to load statuses. Please try again.');
      setStatuses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddOrUpdateStatus = async () => {
    if (!currentStatus.name.trim()) {
      setError('Status name is required');
      return;
    }

    try {
      console.log('🔄 StatusMaster: Saving status...', { modalMode, currentStatus });
      setError(null);
      
      if (modalMode === 'add') {
        const newStatus = await statusApi.createStatus({
          name: currentStatus.name,
          color: currentStatus.color,
          stage: currentStatus.stage,
        });
        console.log('✅ StatusMaster: Status created', newStatus);
      } else {
        const updatedStatus = await statusApi.updateStatus(currentStatus.id, {
          name: currentStatus.name,
          color: currentStatus.color,
          stage: currentStatus.stage,
        });
        console.log('✅ StatusMaster: Status updated', updatedStatus);
      }

      // Close modal first
      setShowModal(false);
      setCurrentStatus({ id: 0, name: '', color: '#0d6efd', stage: '' });

      // Then reload data - IMPORTANT: Don't await, let it happen in background
      console.log('🔄 StatusMaster: Triggering data reload after save...');
      loadStatuses();
      
    } catch (err) {
      console.error('❌ StatusMaster: Error saving status:', err);
      const errorMessage = modalMode === 'add' 
        ? 'Failed to create status. Please try again.' 
        : 'Failed to update status. Please try again.';
      setError(errorMessage);
    }
  };

  const handleDeleteStatus = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this status?')) return;

    try {
      console.log('🔄 StatusMaster: Deleting status ID:', id);
      setError(null);
      await statusApi.deleteStatus(id);
      console.log('✅ StatusMaster: Status deleted');
      
      // Reload data immediately
      console.log('🔄 StatusMaster: Triggering data reload after delete...');
      await loadStatuses();
      
    } catch (err) {
      console.error('❌ StatusMaster: Error deleting status:', err);
      setError('Failed to delete status. Please try again.');
    }
  };

  const handleEditStatus = (status: Status) => {
    setModalMode('edit');
    setCurrentStatus(status);
    setShowModal(true);
  };

  const handleAddNew = () => {
    setModalMode('add');
    setCurrentStatus({ id: 0, name: '', color: '#0d6efd', stage: '' });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentStatus({ id: 0, name: '', color: '#0d6efd', stage: '' });
  };

  const handleRetry = () => {
    setError(null);
    loadStatuses();
  };

  const handleEntriesChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newPerPage = Number(e.target.value);
    setEntriesPerPage(newPerPage);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const filteredStatuses = statuses.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const showingCount = filteredStatuses.length;
  const totalCount = pagination.total_records;
  const hasSearchFilter = searchTerm.trim() !== '';

  if (loading) {
    return (
      <div className="container-fluid">
        <div className="card">
          <div className="card-body">
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
              <div className="text-center">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2 text-muted">Loading statuses...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      {/* Card Container */}
      <div className="card">
        {/* Card Header */}
        <div className="card-header border-0 pt-6">
          <div className="card-title">
            <h3 className="fw-bold m-0">Statuses</h3>
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

              {/* Add Status Button */}
              <button
                onClick={handleAddNew}
                className="btn btn-primary d-flex align-items-center gap-2"
              >
                <i className="bi bi-plus-circle"></i>
                Add Status
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
          <StatusList
            statuses={filteredStatuses}
            onEditStatus={handleEditStatus}
            onDeleteStatus={handleDeleteStatus}
          />
        </div>

        {/* Card Footer */}
        <div className="card-footer d-flex justify-content-between align-items-center py-3">
          <div className="text-gray-600">
            {hasSearchFilter ? (
              <>
                Showing {showingCount} of {statuses.length} entries on this page
                <span className="text-muted"> (from {totalCount} total records)</span>
              </>
            ) : (
              `Showing ${showingCount} of ${totalCount} entries`
            )}
          </div>
          
          {/* Pagination */}
          {pagination.total_pages > 1 && (
            <nav>
              <ul className="pagination mb-0">
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
          )}

          {/* Copyright */}
          <div className="text-gray-600">
            2025 © Arth Technology
          </div>
        </div>
      </div>

      {/* Modal */}
      <StatusModal
        show={showModal}
        mode={modalMode}
        status={currentStatus}
        onClose={handleCloseModal}
        onSave={handleAddOrUpdateStatus}
        onStatusChange={setCurrentStatus}
      />
    </div>
  );
};

export default StatusMaster;