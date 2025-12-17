// ActivityMaster.tsx - Skeleton-ready version
import React, { useState, useEffect } from 'react';
import ActivityList from './ActivityList';
import ActivityModal from './ActivityModal';
import { activityApi, Activity, PaginationInfo } from './core/_request';

const ActivityMaster: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [pagination, setPagination] = useState<PaginationInfo>({
    current_page: 1,
    per_page: 10,
    total_records: 0,
    total_pages: 1
  });

  const [activities, setActivities] = useState<Activity[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [currentActivity, setCurrentActivity] = useState<Activity>({ id: 0, name: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadActivities();
  }, [currentPage, entriesPerPage]);

  const loadActivities = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await activityApi.getActivitiesPaginated(currentPage, entriesPerPage);
      setActivities(response.data);
      setPagination({
        current_page: response.current_page,
        per_page: response.per_page,
        total_records: response.total_records,
        total_pages: response.total_pages
      });
    } catch (err) {
      setError('Failed to load activities. Please try again.');
      setActivities([]);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEntriesChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setEntriesPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => setCurrentPage(page);

  const handleAddOrUpdateActivity = async () => {
    if (!currentActivity.name.trim()) return;
    try {
      setError(null);
      if (modalMode === 'add') {
        await activityApi.createActivity({ name: currentActivity.name });
      } else {
        await activityApi.updateActivity(currentActivity.id, { name: currentActivity.name });
      }
      setCurrentActivity({ id: 0, name: '' });
      setShowModal(false);
      loadActivities();
    } catch (err) {
      setError(modalMode === 'add' ? 'Failed to create activity.' : 'Failed to update activity.');
      console.error(err);
    }
  };

  const handleEditActivity = (activity: Activity) => {
    setModalMode('edit');
    setCurrentActivity(activity);
    setShowModal(true);
  };

  const handleDeleteActivity = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this activity?')) return;
    try {
      setError(null);
      await activityApi.deleteActivity(id);
      loadActivities();
    } catch (err) {
      setError('Failed to delete activity.');
      console.error(err);
    }
  };

  const handleAddNew = () => {
    setModalMode('add');
    setCurrentActivity({ id: 0, name: '' });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentActivity({ id: 0, name: '' });
  };

  const handleRetry = () => loadActivities();

  // Filtered activities for search
  const filteredActivities = activities.filter(a =>
    a.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const showingCount = filteredActivities.length;
  const totalCount = pagination.total_records;
  const hasSearchFilter = searchTerm.trim() !== '';

  return (
    <div className="container-fluid">
      <div className="card">
        {/* Card Header */}
        <div className="card-header py-3 d-flex flex-wrap justify-content-between align-items-center gap-2">
          <h1 className="fw-bold text-gray-800">Activities</h1>
          <div className="d-flex align-items-center gap-2 flex-wrap">
            {/* Search */}
            <div className="position-relative">
              <i className="bi bi-search fs-6 position-absolute ms-2"></i>
              <input
                type="text"
                className="form-control form-control-sm w-150px ps-8"
                placeholder="Search..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
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
                <option value={100}>100</option>
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
          <ActivityList
            activities={filteredActivities}
            onEditActivity={handleEditActivity}
            onDeleteActivity={handleDeleteActivity}
            // Pass loading to allow skeletons inside ActivityList
            loading={loading as any} 
          />
        </div>

        {/* Footer */}
        <div className="card-footer py-2 d-flex justify-content-between flex-wrap gap-2">
          <div className="text-muted fs-7">
            {hasSearchFilter ? (
              <>Showing {showingCount} of {activities.length} (from {totalCount} total)</>
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
      <ActivityModal
        show={showModal}
        mode={modalMode}
        activity={currentActivity}
        onClose={handleCloseModal}
        onSave={handleAddOrUpdateActivity}
        onActivityChange={setCurrentActivity}
      />
    </div>
  );
};

export default ActivityMaster;
