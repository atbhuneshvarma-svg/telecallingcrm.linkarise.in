// StatusMaster.tsx - Compact version
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
    loadStatuses();
  }, [currentPage, entriesPerPage]);

  const loadStatuses = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await statusApi.getStatusesPaginated(currentPage, entriesPerPage);
      setStatuses(response.data);
      setPagination({
        current_page: response.current_page,
        per_page: response.per_page,
        total_records: response.total_records,
        total_pages: response.total_pages,
      });
    } catch (err) {
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
      setError(null);
      if (modalMode === 'add') {
        await statusApi.createStatus({
          name: currentStatus.name,
          color: currentStatus.color,
          stage: currentStatus.stage,
        });
      } else {
        await statusApi.updateStatus(currentStatus.id, {
          name: currentStatus.name,
          color: currentStatus.color,
          stage: currentStatus.stage,
        });
      }

      setShowModal(false);
      setCurrentStatus({ id: 0, name: '', color: '#0d6efd', stage: '' });
      loadStatuses();
    } catch (err) {
      const errorMessage = modalMode === 'add'
        ? 'Failed to create status. Please try again.'
        : 'Failed to update status. Please try again.';
      setError(errorMessage);
    }
  };

  const handleDeleteStatus = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this status?')) return;

    try {
      setError(null);
      await statusApi.deleteStatus(id);
      await loadStatuses();
    } catch (err) {
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
          <div className="card-body py-4">
            <div className="text-center">
              <div className="spinner-border spinner-border-sm text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <span className="text-muted ms-2">Loading statuses...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      {/* Compact Card */}
      <div className="card">
        {/* Compact Header */}
        <div className="card-header py-3">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
            <h5 className="card-title mb-0 fw-bold">Statuses</h5>
            
          </div>
            <div className="d-flex align-items-center gap-2">
              {/* Compact Search */}
              <div className="d-flex align-items-center position-relative">
                <i className="bi bi-search fs-6 position-absolute ms-2"></i>
                <input
                  type="text"
                  className="form-control form-control-sm w-150px ps-8"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Compact Entries Selector */}
              <div className="d-flex align-items-center gap-1">
                <span className="text-muted fs-7">Show</span>
                <select
                  className="form-select form-select-sm w-auto"
                  value={entriesPerPage}
                  onChange={handleEntriesChange}
                >
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                </select>
              </div>

              {/* Compact Add Button */}
              <button
                onClick={handleAddNew}
                className="btn btn-sm btn-primary d-flex align-items-center gap-1"
              >
                <i className="bi bi-plus"></i>
                Add
              </button>
            </div>
        </div>

        {/* Compact Error Alert */}
        {error && (
          <div className="card-body py-2 border-bottom">
            <div className="alert alert-danger alert-dismissible py-2 mb-0" role="alert">
              <div className="d-flex align-items-center gap-2">
                <i className="bi bi-exclamation-triangle-fill fs-6"></i>
                <div className="fs-7">{error}</div>
                <button
                  type="button"
                  className="btn-close btn-close-sm"
                  onClick={() => setError(null)}
                  aria-label="Close"
                ></button>
                <button
                  className="btn btn-sm btn-outline-danger ms-2"
                  onClick={handleRetry}
                >
                  <i className="bi bi-arrow-clockwise"></i>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Card Body - No padding to make table flush */}
        <div className="card-body p-0">
          <StatusList
            statuses={filteredStatuses}
            onEditStatus={handleEditStatus}
            onDeleteStatus={handleDeleteStatus}
          />
        </div>

        {/* Compact Footer */}
        <div className="card-footer py-2">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
            <div className="text-muted fs-7">
              {hasSearchFilter ? (
                <>Showing {showingCount} of {statuses.length} (from {totalCount} total)</>
              ) : (
                `Showing ${showingCount} of ${totalCount} entries`
              )}
            </div>

            {/* Compact Pagination */}
            {pagination.total_pages > 1 && (
              <nav>
                <ul className="pagination pagination-sm mb-0">
                  <li className={`page-item ${pagination.current_page === 1 ? 'disabled' : ''}`}>
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(pagination.current_page - 1)}
                      disabled={pagination.current_page === 1}
                    >
                      &laquo;
                    </button>
                  </li>

                  {Array.from({ length: Math.min(5, pagination.total_pages) }, (_, i) => {
                    let page;
                    if (pagination.total_pages <= 5) {
                      page = i + 1;
                    } else if (pagination.current_page <= 3) {
                      page = i + 1;
                    } else if (pagination.current_page >= pagination.total_pages - 2) {
                      page = pagination.total_pages - 4 + i;
                    } else {
                      page = pagination.current_page - 2 + i;
                    }
                    
                    return (
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
                    );
                  })}

                  <li className={`page-item ${pagination.current_page === pagination.total_pages ? 'disabled' : ''}`}>
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(pagination.current_page + 1)}
                      disabled={pagination.current_page === pagination.total_pages}
                    >
                      &raquo;
                    </button>
                  </li>
                </ul>
              </nav>
            )}

            <div className="text-muted fs-7">
              © Arth Technology
            </div>
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
        isLoading={loading}
        error={error}
      />
    </div>
  );
};

export default StatusMaster;