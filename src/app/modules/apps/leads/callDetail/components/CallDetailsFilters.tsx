import React, { useState, useEffect } from 'react';
import { useLeads } from '../../allleads/core/LeadsContext';

interface CallDetailsFiltersProps {
  entriesPerPage: number;
  onEntriesPerPageChange: (value: number) => void;
  filters: {
    user: string;
    campaign: string;
    status: string;
    date: string;
  };
  onFiltersChange: (filters: any) => void;
  onReset: () => void;
  loading?: boolean;
  totalRecords?: number;
}

const CallDetailsFilters: React.FC<CallDetailsFiltersProps> = ({
  entriesPerPage,
  onEntriesPerPageChange,
  filters,
  onFiltersChange,
  onReset,
  loading = false,
  totalRecords = 0,
}) => {
  const { dropdowns } = useLeads();
  const [localDate, setLocalDate] = useState(filters.date);

  // Set default to current date on component mount
  useEffect(() => {
    if (!filters.date) {
      const today = new Date().toISOString().split('T')[0];
      setLocalDate(today);
      onFiltersChange({
        ...filters,
        date: today
      });
    }
  }, []);

  const handleEntriesChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onEntriesPerPageChange(Number(e.target.value));
  };

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = {
      ...filters,
      [key]: value,
    };
    onFiltersChange(newFilters);
    
    // Update local date state
    if (key === 'date') {
      setLocalDate(value);
    }
  };

  const handleResetAll = () => {
    const today = new Date().toISOString().split('T')[0];
    setLocalDate(today);
    onReset();
  };

  const clearDateFilter = () => {
    const today = new Date().toISOString().split('T')[0];
    setLocalDate(today);
    handleFilterChange('date', today);
  };

  // Get unique users from dropdowns
  const users = dropdowns?.users || [];
  const campaigns = dropdowns?.campaigns || [];
  const statuses = dropdowns?.statuses || [];

  // Check if any filters are active (excluding default date)
  const hasActiveFilters = 
    filters.user !== 'All' || 
    filters.campaign !== 'All' || 
    filters.status !== 'All' ||
    (filters.date && filters.date !== new Date().toISOString().split('T')[0]);

  return (
    <div className="card card-flush mb-6">
      <div className="card-body">
        {/* Header Section */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="d-flex align-items-center gap-3">
            {hasActiveFilters && (
              <button 
                className="btn btn-sm btn-light-danger"
                onClick={handleResetAll}
                disabled={loading}
              >
                <i className="bi bi-x-circle me-2"></i>
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Filters Row */}
        <div className="row g-4">
          {/* User Filter */}
          <div className="col-md-3">
            <label className="form-label">Telecaller</label>
            <select
              value={filters.user}
              onChange={(e) => handleFilterChange('user', e.target.value)}
              className="form-select"
              disabled={loading}
            >
              <option value="All">All Telecallers</option>
              {users.map((user) => (
                <option key={user.usermid} value={user.username}>
                  {user.username}
                </option>
              ))}
            </select>
          </div>

          {/* Campaign Filter */}
          <div className="col-md-3">
            <label className="form-label">Campaign</label>
            <select
              value={filters.campaign}
              onChange={(e) => handleFilterChange('campaign', e.target.value)}
              className="form-select"
              disabled={loading}
            >
              <option value="All">All Campaigns</option>
              {campaigns.map((campaign) => (
                <option key={campaign.id} value={campaign.name}>
                  {campaign.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="col-md-3">
            <label className="form-label">Status</label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="form-select"
              disabled={loading}
            >
              <option value="All">All Statuses</option>
              {statuses.map((status) => (
                <option key={status.statusmid} value={status.statusname}>
                  {status.statusname}
                </option>
              ))}
            </select>
          </div>

          {/* Date Filter */}
          <div className="col-md-3">
            <label className="form-label">Date</label>
            <div className="input-group">
              <input
                type="date"
                value={localDate}
                onChange={(e) => handleFilterChange('date', e.target.value)}
                className="form-control"
                disabled={loading}
              />
              {filters.date && filters.date !== new Date().toISOString().split('T')[0] && (
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={clearDateFilter}
                  disabled={loading}
                  title="Reset to today"
                >
                  <i className="bi bi-arrow-clockwise"></i>
                </button>
              )}
            </div>
          </div>
        </div>


        {/* Active Filters Indicator */}
        {hasActiveFilters && (
          <div className="row mt-3">
            <div className="col-12">
              <div className="d-flex align-items-center gap-2 p-3 bg-light-primary rounded">
                <i className="bi bi-funnel text-primary"></i>
                <span className="text-primary fw-medium">Active Filters:</span>
                {filters.user !== 'All' && (
                  <span className="badge bg-primary">Telecaller: {filters.user}</span>
                )}
                {filters.campaign !== 'All' && (
                  <span className="badge bg-primary">Campaign: {filters.campaign}</span>
                )}
                {filters.status !== 'All' && (
                  <span className="badge bg-primary">Status: {filters.status}</span>
                )}
                {filters.date && filters.date !== new Date().toISOString().split('T')[0] && (
                  <span className="badge bg-primary">
                    Date: {new Date(filters.date).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CallDetailsFilters;