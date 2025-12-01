// src/app/modules/apps/leads/statuswise/components/Filters/StatusFilters.tsx
import React from 'react'
import { Filters, FilterOptions } from '../core/_models'

interface StatusFiltersProps {
  filters: Filters
  filterOptions: FilterOptions
  dateRange: [Date, Date]
  onFilterChange: (filters: Filters) => void
  onDateChange: (dates: [Date, Date]) => void
  onApplyFilters: () => void
  onResetFilters: () => void
}

const StatusFilters: React.FC<StatusFiltersProps> = ({
  filters,
  filterOptions,
  dateRange,
  onFilterChange,
  onDateChange,
  onApplyFilters,
  onResetFilters
}) => {
  return (
    <div className="row mb-4">
      <div className="col-md-12">
        <div className="row g-3">
          {/* Filter Labels Row */}
          <div className="col-12">
            <div className="row">
              <div className="col-md-3">
                <label className="form-label" style={{ fontSize: '14px', fontWeight: '500', color: '#666' }}>
                  Select Date
                </label>
              </div>
              <div className="col-md-3">
                <label className="form-label" style={{ fontSize: '14px', fontWeight: '500', color: '#666' }}>
                  Select Campaign
                </label>
              </div>
              <div className="col-md-3">
                <label className="form-label" style={{ fontSize: '14px', fontWeight: '500', color: '#666' }}>
                  Select User
                </label>
              </div>
              <div className="col-md-3">
                <label className="form-label" style={{ fontSize: '14px', fontWeight: '500', color: '#666' }}>
                  Select Status
                </label>
              </div>
            </div>
          </div>

          {/* Filter Inputs Row */}
          <div className="col-12">
            <div className="row">
              {/* Date Range Picker */}
              <div className="col-md-3">
                <div className="input-group">
                  <input
                    type="date"
                    className="form-control"
                    value={filters.date_from}
                    onChange={e => onFilterChange({ ...filters, date_from: e.target.value })}
                    style={{ height: '38px', fontSize: '14px' }}
                  />
                  <span className="input-group-text" style={{ fontSize: '14px' }}>to</span>
                  <input
                    type="date"
                    className="form-control"
                    value={filters.date_to}
                    onChange={e => onFilterChange({ ...filters, date_to: e.target.value })}
                    style={{ height: '38px', fontSize: '14px' }}
                  />
                </div>
              </div>

              {/* Campaign Dropdown */}
              <div className="col-md-3">
                <select
                  className="form-select"
                  value={filters.campaign}
                  onChange={e => onFilterChange({ ...filters, campaign: e.target.value })}
                  style={{ height: '38px' }}
                >
                  <option value="">Select</option>
                  {filterOptions.campaigns.map(campaign => (
                    <option key={campaign.value} value={campaign.value}>
                      {campaign.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* User Dropdown */}
              <div className="col-md-3">
                <select
                  className="form-select"
                  value={filters.telecaller}
                  onChange={e => onFilterChange({ ...filters, telecaller: e.target.value })}
                  style={{ height: '38px' }}
                >
                  <option value="">Select</option>
                  {filterOptions.telecallers.map(telecaller => (
                    <option key={telecaller.value} value={telecaller.value}>
                      {telecaller.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Dropdown */}
              <div className="col-md-3">
                <select
                  className="form-select"
                  value={filters.statusname}
                  onChange={e => onFilterChange({ ...filters, statusname: e.target.value })}
                  style={{ height: '38px' }}
                >
                  <option value="">Select</option>
                  {filterOptions.statuses.map(status => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Action Buttons Row */}
          <div className="col-12">
            <div className="row">
              <div className="col-md-12">
                <div className="d-flex gap-2">
                  <button 
                    className="btn btn-primary"
                    onClick={onApplyFilters}
                    style={{ 
                      padding: '6px 20px',
                      fontSize: '14px',
                      fontWeight: '500'
                    }}
                  >
                    Submit
                  </button>
                  <button 
                    className="btn btn-secondary"
                    onClick={onResetFilters}
                    style={{ 
                      padding: '6px 20px',
                      fontSize: '14px',
                      fontWeight: '500'
                    }}
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StatusFilters