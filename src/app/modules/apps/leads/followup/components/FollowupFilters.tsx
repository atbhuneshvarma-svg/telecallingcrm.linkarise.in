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
  const { dropdowns } = useLeads()

  // Function to get current date in YYYY-MM-DD format
  const getCurrentDate = () => {
    return new Date().toISOString().split('T')[0]
  }

  // Set default current date if no date is selected
  React.useEffect(() => {
    if (!filters.followupDate) {
      const currentDate = getCurrentDate()
      onFiltersChange({
        ...filters,
        followupDate: currentDate
      })
    }
  }, [filters.followupDate, onFiltersChange])

  const handleFilterChange = (key: string, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    })
  }

  const handleResetAll = () => {
    onReset()
  }

  return (
    <div className="card card-flush mb-6">
      <div className="card-body">
        {/* Header Section */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 className="fw-bold text-gray-800 mb-2">Follow-up Leads</h1>
          </div>
          <div className="d-flex align-items-center gap-3">
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

        <div className="row g-4">
          {/* User Filter */}
          {(isAdmin || isManager) && (<div className="col-md-3">
            <label className="form-label">Assigned To</label>
            <select
              value={filters.user}
              onChange={(e) => handleFilterChange('user', e.target.value)}
              className="form-select"
              disabled={loading}
            >
              <option value="All">All Users</option>
              {dropdowns.users.map((user) => (
                <option key={user.usermid} value={user.username}>
                  {user.username}
                </option>
              ))}
            </select>
          </div>
          )}

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
              {dropdowns.campaigns.map((campaign) => (
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
              {dropdowns.statuses.map((status) => (
                <option key={status.statusmid} value={status.statusname}>
                  {status.statusname}
                </option>
              ))}
            </select>
          </div>

          {/* Follow-up Date Filter */}
          <div className="col-md-3">
            <label className="form-label">Follow-up Date</label>
            <input
              type="date"
              value={filters.followupDate || getCurrentDate()}
              onChange={(e) => handleFilterChange('followupDate', e.target.value)}
              className="form-control"
              disabled={loading}
            />
          </div>
        </div>

        {/* Quick Date Filters */}
        <div className="row mt-4">
          <div className="col-12">
            <label className="form-label mb-2">Quick Date Filters</label>
            <div className="d-flex gap-2 flex-wrap">
              <button
                type="button"
                className={`btn btn-sm ${filters.followupDate === getCurrentDate() ? 'btn-primary' : 'btn-light'}`}
                onClick={() => handleFilterChange('followupDate', getCurrentDate())}
                disabled={loading}
              >
                Today
              </button>
              <button
                type="button"
                className={`btn btn-sm ${filters.followupDate === new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0] ? 'btn-primary' : 'btn-light'}`}
                onClick={() => {
                  const tomorrow = new Date()
                  tomorrow.setDate(tomorrow.getDate() + 1)
                  handleFilterChange('followupDate', tomorrow.toISOString().split('T')[0])
                }}
                disabled={loading}
              >
                Tomorrow
              </button>
              {filters.followupDate && (
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary"
                  onClick={() => handleFilterChange('followupDate', '')}
                  disabled={loading}
                >
                  Clear Date
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default React.memo(FollowupFilters)