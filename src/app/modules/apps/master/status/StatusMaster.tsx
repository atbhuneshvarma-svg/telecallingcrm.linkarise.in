// StatusMaster.tsx - Skeleton-ready version
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
    } catch {
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
        await statusApi.createStatus(currentStatus);
      } else {
        await statusApi.updateStatus(currentStatus.id, currentStatus);
      }
      setShowModal(false);
      setCurrentStatus({ id: 0, name: '', color: '#0d6efd', stage: '' });
      loadStatuses();
    } catch {
      setError(modalMode === 'add' ? 'Failed to create status.' : 'Failed to update status.');
    }
  };

  const handleDeleteStatus = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this status?')) return;
    try {
      setError(null);
      await statusApi.deleteStatus(id);
      loadStatuses();
    } catch {
      setError('Failed to delete status.');
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

  const handleRetry = () => loadStatuses();

  const handleEntriesChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setEntriesPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => setCurrentPage(page);

  // Filtered statuses for search
  const filteredStatuses = statuses.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const showingCount = filteredStatuses.length;
  const totalCount = pagination.total_records;
  const hasSearchFilter = searchTerm.trim() !== '';

  return (
    <div className="container-fluid">
      <div className="card">
        {/* Header */}
        <div className="card-header py-3 d-flex flex-wrap justify-content-between align-items-center gap-2">
          <h1 className="fw-bold text-gray-800">Statuses</h1>
          <div className="d-flex align-items-center gap-2 flex-wrap">
            {/* Search */}
            <div className="position-relative">
              <input
                type="text"
                className="form-control form-control-sm w-150px ps-8"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Entries selector */}
            <div className="d-flex align-items-center gap-1">
              <span className="text-muted fs-7">Show</span>
              <select
                className="form-select form-select-sm w-auto"
                value={entriesPerPage}
                onChange={handleEntriesChange}
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>

            {/* Add button */}
            <button onClick={handleAddNew} className="btn btn-sm btn-primary d-flex align-items-center gap-1">
              <i className="bi bi-plus"></i> Add
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="card-body py-2 border-bottom">
            <div className="alert alert-danger alert-dismissible py-2 mb-0 d-flex align-items-center gap-2">
              <i className="bi bi-exclamation-triangle-fill fs-6"></i>
              <div className="fs-7">{error}</div>
              <button type="button" className="btn-close btn-close-sm" onClick={() => setError(null)}></button>
              <button className="btn btn-sm btn-outline-danger ms-2" onClick={handleRetry}>
                <i className="bi bi-arrow-clockwise"></i>
              </button>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="card-body p-0">
          <StatusList
            statuses={filteredStatuses}
            loading={loading}  // Skeleton will render inside StatusList
            onEditStatus={handleEditStatus}
            onDeleteStatus={handleDeleteStatus}
          />
        </div>

        {/* Footer */}
        <div className="card-footer py-2 d-flex justify-content-between flex-wrap gap-2">
          <div className="text-muted fs-7">
            {hasSearchFilter ? (
              <>Showing {showingCount} of {statuses.length} (from {totalCount} total)</>
            ) : (
              `Showing ${showingCount} of ${totalCount} entries`
            )}
          </div>

          {/* Pagination */}
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
                  if (pagination.total_pages <= 5) page = i + 1;
                  else if (pagination.current_page <= 3) page = i + 1;
                  else if (pagination.current_page >= pagination.total_pages - 2) page = pagination.total_pages - 4 + i;
                  else page = pagination.current_page - 2 + i;

                  return (
                    <li key={page} className={`page-item ${pagination.current_page === page ? 'active' : ''}`}>
                      <button className="page-link" onClick={() => handlePageChange(page)}>{page}</button>
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
