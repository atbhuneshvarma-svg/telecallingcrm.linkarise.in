// src/app/modules/apps/master/activity/ActivityMaster.tsx
import React, { useState, useEffect } from 'react';
import ActivityList from './ActivityList';
import ActivityModal from './ActivityModal';
import { activityApi, Activity, PaginationInfo } from './core/_request';

const ActivityMaster: React.FC = () => {
  // State for pagination
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

  // Load activities from API when page or entries per page changes
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
      console.error('Error loading activities:', err);
      setActivities([]);
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

  const handleAddOrUpdateActivity = async () => {
    if (!currentActivity.name.trim()) return;

    try {
      setError(null);
      if (modalMode === 'add') {
        await activityApi.createActivity({
          name: currentActivity.name
        });
      } else {
        await activityApi.updateActivity(currentActivity.id, {
          name: currentActivity.name
        });
      }

      // Refresh the list to get updated pagination
      await loadActivities();
      setCurrentActivity({ id: 0, name: '' });
      setShowModal(false);
    } catch (err) {
      const errorMessage = modalMode === 'add' 
        ? 'Failed to create activity. Please try again.' 
        : 'Failed to update activity. Please try again.';
      setError(errorMessage);
      console.error('Error saving activity:', err);
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
      // Refresh to update pagination
      await loadActivities();
    } catch (err) {
      setError('Failed to delete activity. Please try again.');
      console.error('Error deleting activity:', err);
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

  const handleRetry = () => {
    setError(null);
    loadActivities();
  };

  // Client-side filtering for search (only filters the current page)
  const filteredActivities = activities.filter((activity) =>
    activity.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate display information
  const showingCount = filteredActivities.length;
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
                <p className="mt-2 text-muted">Loading activities...</p>
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
            <h3 className="fw-bold m-0">Activities</h3>
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

              {/* Add Activity Button */}
              <button
                onClick={handleAddNew}
                className="btn btn-primary d-flex align-items-center gap-2"
              >
                <i className="bi bi-plus-circle"></i>
                Add Activity
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
          <ActivityList
            activities={filteredActivities}
            onEditActivity={handleEditActivity}
            onDeleteActivity={handleDeleteActivity}
          />
        </div>

        {/* Card Footer */}
        <div className="card-footer d-flex justify-content-between align-items-center py-3">
          <div className="text-gray-600">
            {hasSearchFilter ? (
              <>
                Showing {showingCount} of {activities.length} entries on this page
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