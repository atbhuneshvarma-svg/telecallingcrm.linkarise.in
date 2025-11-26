import React, { useState, useEffect } from 'react';
import { useLeads } from '../../allleads/core/LeadsContext';

interface CallDetailsFiltersProps {
  entriesPerPage: number;
  onEntriesPerPageChange: (value: number) => void;
  filters: {
    user: string;
    campaign: string;
    status: string;
    startDate: string;
    endDate: string;
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
  const [localStartDate, setLocalStartDate] = useState(filters.startDate || '');
  const [localEndDate, setLocalEndDate] = useState(filters.endDate || '');

  // Set default to current date on component mount
  useEffect(() => {
    if (!filters.startDate && !filters.endDate) {
      const today = new Date().toISOString().split('T')[0];
      setLocalStartDate(today);
      setLocalEndDate(today);
      onFiltersChange({
        ...filters,
        startDate: today,
        endDate: today
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
  };

  const handleDateRangeChange = (type: 'start' | 'end', value: string) => {
    if (type === 'start') {
      setLocalStartDate(value);
      onFiltersChange({
        ...filters,
        startDate: value
      });
    } else {
      setLocalEndDate(value);
      onFiltersChange({
        ...filters,
        endDate: value
      });
    }
  };

  const handleResetAll = () => {
    const today = new Date().toISOString().split('T')[0];
    setLocalStartDate(today);
    setLocalEndDate(today);
    onReset();
  };

  const clearDateFilter = () => {
    const today = new Date().toISOString().split('T')[0];
    setLocalStartDate(today);
    setLocalEndDate(today);
    onFiltersChange({
      ...filters,
      startDate: today,
      endDate: today
    });
  };

  // Get unique users from dropdowns
  const users = dropdowns?.users || [];
  const campaigns = dropdowns?.campaigns || [];
  const statuses = dropdowns?.statuses || [];

  // Check if any filters are active (excluding default date)
  const today = new Date().toISOString().split('T')[0];
  const hasActiveFilters = 
    filters.user !== 'All' || 
    filters.campaign !== 'All' || 
    filters.status !== 'All' ||
    filters.startDate !== today ||
    filters.endDate !== today;

  // Format date for display
  const formatDisplayDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Find display names for IDs
  const getUserDisplayName = (usermid: string) => {
    const user = users.find(u => u.usermid?.toString() === usermid);
    return user?.username || usermid;
  };

  const getCampaignDisplayName = (campaignId: string) => {
    const campaign = campaigns.find(c => c.id?.toString() === campaignId);
    return campaign?.name || campaignId;
  };

  const getStatusDisplayName = (statusId: string) => {
    const status = statuses.find(s => s.statusmid?.toString() === statusId);
    return status?.statusname || statusId;
  };

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
                <option key={user.usermid} value={user.usermid?.toString()}>
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
                <option key={campaign.id} value={campaign.id?.toString()}>
                  {campaign.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="col-md-2">
            <label className="form-label">Status</label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="form-select"
              disabled={loading}
            >
              <option value="All">All Statuses</option>
              {statuses.map((status) => (
                <option key={status.statusmid} value={status.statusmid?.toString()}>
                  {status.statusname}
                </option>
              ))}
            </select>
          </div>

          {/* Start Date Filter */}
          <div className="col-md-2">
            <label className="form-label">Start Date</label>
            <div className="input-group">
              <input
                type="date"
                value={localStartDate}
                onChange={(e) => handleDateRangeChange('start', e.target.value)}
                className="form-control"
                disabled={loading}
              />
            </div>
          </div>

          {/* End Date Filter */}
          <div className="col-md-2">
            <label className="form-label">End Date</label>
            <div className="input-group">
              <input
                type="date"
                value={localEndDate}
                onChange={(e) => handleDateRangeChange('end', e.target.value)}
                className="form-control"
                disabled={loading}
              />
              {(filters.startDate !== today || filters.endDate !== today) && (
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
                  <span className="badge bg-primary">
                    Telecaller: {getUserDisplayName(filters.user)}
                  </span>
                )}
                {filters.campaign !== 'All' && (
                  <span className="badge bg-primary">
                    Campaign: {getCampaignDisplayName(filters.campaign)}
                  </span>
                )}
                {filters.status !== 'All' && (
                  <span className="badge bg-primary">
                    Status: {getStatusDisplayName(filters.status)}
                  </span>
                )}
                {(filters.startDate !== today || filters.endDate !== today) && (
                  <span className="badge bg-primary">
                    Date Range: {formatDisplayDate(filters.startDate)} to {formatDisplayDate(filters.endDate)}
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