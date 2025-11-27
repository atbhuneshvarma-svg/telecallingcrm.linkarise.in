// components/FollowupFilters.tsx
import React from 'react'
import { useLeads } from '../../allleads/core/LeadsContext'
import { useAuth } from '../../../../auth';

interface FollowupFiltersProps {
  filters: {
    user: string
    campaign: string
    status: string
    followupDate: string
  }
  onFiltersChange: (filters: any) => void
  onReset: () => void
  loading?: boolean
}

const FollowupFilters: React.FC<FollowupFiltersProps> = ({
  filters,
  onFiltersChange,
  onReset,
  loading = false,
}) => {
  const { currentUser } = useAuth();
  const userRole = currentUser?.user?.userrole || 'telecaller';
  const isAdmin = userRole === 'admin';
  const isManager = userRole === 'manager';
  const { dropdowns } = useLeads();

  const getCurrentDate = () => new Date().toISOString().split("T")[0];

  const updateFilter = (key: string, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const handleResetAll = () => {
    onReset();
  };

  return (
    <div className="card card-flush mb-6">
      <div className="card-body">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 className="fw-bold text-gray-800 mb-2">Follow-up Leads</h1>
          </div>

          <div className="d-flex gap-3"> 
               <div className="d-flex gap-2 flex-wrap">
              <button
                type="button"
                className={`btn btn-sm ${
                  filters.followupDate === getCurrentDate()
                    ? "btn-primary"
                    : "btn-light"
                }`}
                onClick={() => updateFilter("followupDate", getCurrentDate())}
                disabled={loading}
              >
                Today
              </button>

              <button
                type="button"
                className={`btn btn-sm ${
                  filters.followupDate ===
                  new Date(Date.now() + 86400000).toISOString().split("T")[0]
                    ? "btn-primary"
                    : "btn-light"
                }`}
                onClick={() => {
                  const tomorrow = new Date();
                  tomorrow.setDate(tomorrow.getDate() + 1);
                  updateFilter("followupDate", tomorrow.toISOString().split("T")[0]);
                }}
                disabled={loading}
              >
                Tomorrow
              </button>

            </div>
            <button
              className="btn btn-light btn-active-light-primary"
              onClick={handleResetAll}
              disabled={loading}
            >
              <i className="bi bi-arrow-clockwise me-2"></i>
              Reset Filters
            </button>
          </div>
        </div>

        {/* Main Filters - USING NUMERIC IDs */}
        <div className="row g-4">
          {(isAdmin || isManager) && (
            <div className="col-md-3">
              <label className="form-label">Assigned To</label>
              <select
                value={filters.user}
                onChange={(e) => updateFilter("user", e.target.value)}
                className="form-select"
                disabled={loading}
              >
                <option value="All">All Users</option>
                {dropdowns.users.map((user) => (
                  // Use usermid (numeric) as value, display username
                  <option key={user.usermid} value={user.usermid.toString()}>
                    {user.username}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="col-md-3">
            <label className="form-label">Campaign</label>
            <select
              value={filters.campaign}
              onChange={(e) => updateFilter("campaign", e.target.value)}
              className="form-select"
              disabled={loading}
            >
              <option value="All">All Campaigns</option>
              {dropdowns.campaigns.map((campaign) => (
                // Use campaign ID (numeric) as value, display name
                <option key={campaign.id} value={campaign.id.toString()}>
                  {campaign.name}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-3">
            <label className="form-label">Status</label>
            <select
              value={filters.status}
              onChange={(e) => updateFilter("status", e.target.value)}
              className="form-select"
              disabled={loading}
            >
              <option value="All">All Statuses</option>
              {dropdowns.statuses.map((status) => (
                // Use statusname as value (text like "Warm")
                <option key={status.statusmid} value={status.statusname}>
                  {status.statusname}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-3">
            <label className="form-label">Follow-up Date</label>
            <input
              type="date"
              value={filters.followupDate}
              onChange={(e) => updateFilter("followupDate", e.target.value)}
              className="form-control"
              disabled={loading}
            />
          </div>
        </div>

      
      </div>
    </div>
  );
};

export default React.memo(FollowupFilters);