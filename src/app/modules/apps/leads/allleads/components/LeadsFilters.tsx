import React from 'react';
import { useToast } from '../hooks/useToast'; // Adjust the import path
import { useAuth } from '../../../../auth';

interface LeadsFiltersProps {
  filters: {
    user: string;
    campaign: string;
    status: string;
    team: string;
  };
  onFilterChange: (filterType: 'user' | 'campaign' | 'status' | 'team', value: string) => void;
  onFilterSubmit?: () => void;
  onFilterReset?: () => void;
  uniqueUsers: string[];
  uniqueTeams: string[];
  uniqueCampaigns: string[];
  uniqueStatuses: string[];
  loading?: boolean;
  totalLeads?: number;
  filteredCount?: number;
  showQuickFilters?: boolean;
  serverSideFiltering?: boolean;
}

const LeadsFilters: React.FC<LeadsFiltersProps> = ({
  filters,
  onFilterChange,
  onFilterSubmit,
  onFilterReset,
  uniqueUsers,
  uniqueTeams,
  uniqueCampaigns,
  uniqueStatuses,
  loading = false,
  totalLeads = 0,
  filteredCount = 0,
  showQuickFilters = true,
  serverSideFiltering = false
}) => {

  const { currentUser } = useAuth();
  const userRole = currentUser?.user?.userrole || 'telecaller';
  const isAdmin = userRole === 'admin';
  const isManager = userRole === 'manager';

  const { showSuccess, showInfo } = useToast(); // Use your toast hook

  const handleFilterChange = (filterType: 'user' | 'campaign' | 'status' | 'team', value: string) => {
    onFilterChange(filterType, value);

    // Auto-submit when dropdown filters change
    if (onFilterSubmit) {
      onFilterSubmit();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onFilterSubmit) {
      onFilterSubmit();
    }
    showInfo('Applying filters...'); // Real toast notification
  };

  const handleReset = async () => {
    // Reset all filters to default values
    onFilterChange('team', 'All Teams');
    onFilterChange('user', 'All Users');
    onFilterChange('campaign', 'All Campaigns');
    onFilterChange('status', 'All Statuses');

    if (onFilterReset) {
      onFilterReset();
    }

    showSuccess('Filters reset successfully'); // Real toast notification
  };

  const hasActiveFilters =
    filters.team !== 'All Teams' ||
    filters.user !== 'All Users' ||
    filters.campaign !== 'All Campaigns' ||
    filters.status !== 'All Statuses';

  // Show results count if we have data
  return (
    <div className="">
      <div className="card-body pt-0">
        {/* Results Summary and Reset Button */}
        <div className="d-flex justify-content-between align-items-center">
          {/* Reset Filters Button */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleReset}
              className="btn btn-sm btn-light"
              disabled={loading}
            >
              <i className="ki-duotone ki-cross fs-2 me-1">
                <span className="path1"></span>
                <span className="path2"></span>
              </i>
              Reset Filters
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="row">

            {(isAdmin || isManager) && (<>
              {/* Team Filter */}
              <div className="col-md-3 col-sm-6">
                <label className="form-label">Team</label>
                <select
                  value={filters.team}
                  onChange={(e) => handleFilterChange('team', e.target.value)}
                  className="form-select form-select-sm"
                  disabled={loading}
                >
                  {uniqueTeams.map((team, index) => (
                    <option key={`team-${index}`} value={team}>
                      {team}
                    </option>
                  ))}
                </select>
              </div>

              {/* User Filter */}
              <div className="col-md-3 col-sm-6">
                <label className="form-label">Assigned To</label>
                <select
                  value={filters.user}
                  onChange={(e) => handleFilterChange('user', e.target.value)}
                  className="form-select form-select-sm"
                  disabled={loading}
                >
                  {uniqueUsers.map((user, index) => (
                    <option key={`user-${index}`} value={user}>
                      {user}
                    </option>
                  ))}
                </select>
              </div>
            </>)}


            {/* Campaign Filter */}
            <div className="col-md-3 col-sm-6">
              <label className="form-label">Campaign</label>
              <select
                value={filters.campaign}
                onChange={(e) => handleFilterChange('campaign', e.target.value)}
                className="form-select form-select-sm"
                disabled={loading}
              >
                {uniqueCampaigns.map((campaign, index) => (
                  <option key={`campaign-${index}`} value={campaign}>
                    {campaign}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div className="col-md-3 col-sm-6">
              <label className="form-label">Status</label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="form-select form-select-sm"
                disabled={loading}
              >
                {uniqueStatuses.map((status, index) => (
                  <option key={`status-${index}`} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Manual Submit Button (optional) */}
          {!serverSideFiltering && (
            <div className="row mt-4">
              <div className="col-12">
                <div className="d-flex gap-2 justify-content-end">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="btn btn-light"
                    disabled={loading}
                  >
                    Reset
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? 'Applying...' : 'Apply Filters'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default LeadsFilters;