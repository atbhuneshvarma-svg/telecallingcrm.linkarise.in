import React, { useState, useEffect, useRef } from 'react';
import { useLeads } from '../../allleads/core/LeadsContext';
import { DateRangePicker } from 'react-date-range';
import { format } from 'date-fns';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

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
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection'
    }
  ]);
  const datePickerRef = useRef<HTMLDivElement>(null);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setShowDatePicker(false);
      }
    };

    if (showDatePicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDatePicker]);

  // Set default to current date on component mount
  useEffect(() => {
    if (!filters.startDate && !filters.endDate) {
      const today = new Date().toISOString().split('T')[0];
      onFiltersChange({
        ...filters,
        startDate: today,
        endDate: today
      });
    }
  }, []);

  // Update dateRange when filters change
  useEffect(() => {
    if (filters.startDate && filters.endDate) {
      setDateRange([
        {
          startDate: new Date(filters.startDate),
          endDate: new Date(filters.endDate),
          key: 'selection'
        }
      ]);
    }
  }, [filters.startDate, filters.endDate]);

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

  const handleDateRangeChange = (ranges: any) => {
    const range = ranges.selection;
    setDateRange([range]);

    const startDate = format(range.startDate, 'yyyy-MM-dd');
    const endDate = format(range.endDate, 'yyyy-MM-dd');

    onFiltersChange({
      ...filters,
      startDate,
      endDate
    });
  };

  const handleQuickDateRange = (days: number) => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days);

    setDateRange([{
      startDate,
      endDate,
      key: 'selection'
    }]);

    onFiltersChange({
      ...filters,
      startDate: format(startDate, 'yyyy-MM-dd'),
      endDate: format(endDate, 'yyyy-MM-dd')
    });
    setShowDatePicker(false);
  };

  const handleResetAll = () => {
    const today = new Date().toISOString().split('T')[0];
    setDateRange([{
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection'
    }]);
    onReset();
  };

  const clearDateFilter = () => {
    const today = new Date().toISOString().split('T')[0];
    setDateRange([{
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection'
    }]);
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

  // Check if any filters are active
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

  const getDisplayDateRange = () => {
    if (filters.startDate === filters.endDate) {
      return formatDisplayDate(filters.startDate);
    }
    return `${formatDisplayDate(filters.startDate)} - ${formatDisplayDate(filters.endDate)}`;
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

        {/* Date Range Filter */}
        {/* Filters Row */}
        <div className="row g-4">
          <div className="col-md-4 position-relative" ref={datePickerRef}>
            <label className="form-label">Date Range</label>
            <div className="input-group">
              <button
                className="form-control text-start"
                onClick={() => setShowDatePicker(!showDatePicker)}
                disabled={loading}
                style={{ cursor: 'pointer' }}
              >
                <i className="bi bi-calendar me-2"></i>
                {getDisplayDateRange()}
              </button>
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
              {/* Date Range Picker */}
              {showDatePicker && (
                <div
                  className="position-absolute top-100 start-0 mt-1 bg-white border rounded shadow-lg"
                  style={{
                    zIndex: 9999,
                    width: 'max-content',
                    transform: 'scale(0.8)', // Scale it down
                    transformOrigin: 'top left' // Keep it positioned correctly
                  }}
                >
                  <DateRangePicker
                    onChange={handleDateRangeChange}
                    moveRangeOnFirstSelection={false}
                    months={1} // Show only 1 month instead of 2
                    ranges={dateRange}
                    direction="horizontal"
                    showDateDisplay={false}
                  />
                  <div className="p-2 border-top">
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => setShowDatePicker(false)}
                    >
                      Apply
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
          {/* User Filter */}
          <div className="col-md-3">
            <label className="form-label">User</label>
            <select
              value={filters.user}
              onChange={(e) => handleFilterChange('user', e.target.value)}
              className="form-select"
              disabled={loading}
            >
              <option value="All">All Users</option>
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
                    Date: {getDisplayDateRange()}
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