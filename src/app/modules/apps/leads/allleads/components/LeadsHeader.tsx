import React, { useMemo } from 'react'

interface LeadsHeaderProps {
  onAddClick: () => void
  onExportClick?: () => void
  onImportClick?: () => void
  onRefreshClick?: () => void
  totalLeads?: number
  loading?: boolean
  filteredCount?: number
  showStats?: boolean
  stats?: {
    freshLeads?: number
    convertedLeads?: number
    pendingFollowups?: number
  }
}

const LeadsHeader: React.FC<LeadsHeaderProps> = ({ 
  onAddClick, 
  onExportClick,
  onImportClick,
  onRefreshClick,
  totalLeads = 0,
  loading = false,
  filteredCount = 0,
  showStats = false,
  stats = {}
}) => {
  
  // Memoized statistics to prevent unnecessary recalculations
  const headerStats = useMemo(() => {
    const isFiltered = filteredCount !== totalLeads && totalLeads > 0
    
    return {
      displayCount: isFiltered ? filteredCount : totalLeads,
      isFiltered,
      showStats: showStats && totalLeads > 0
    }
  }, [totalLeads, filteredCount, showStats])

  return (
    <div className="">
      <div className="card-header border-0">
        {/* Main Title Section */}
        <div className="card-title flex-column">
          <h1 className="fw-bold text-gray-800">Lead Management</h1>
          <div className="d-flex align-items-center gap-4 flex-wrap">
           
            {/* Statistics Badges */}
            {headerStats.showStats && (
              <div className="d-flex align-items-center gap-3">
                {stats.freshLeads !== undefined && stats.freshLeads > 0 && (
                  <span className="badge badge-light-primary">
                    <i className="bi bi-lightning-charge me-1"></i>
                    {stats.freshLeads} fresh
                  </span>
                )}
                {stats.convertedLeads !== undefined && stats.convertedLeads > 0 && (
                  <span className="badge badge-light-success">
                    <i className="bi bi-check-circle me-1"></i>
                    {stats.convertedLeads} converted
                  </span>
                )}
                {stats.pendingFollowups !== undefined && stats.pendingFollowups > 0 && (
                  <span className="badge badge-light-warning">
                    <i className="bi bi-clock-history me-1"></i>
                    {stats.pendingFollowups} follow-ups
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="card-toolbar">
          <div className="d-flex align-items-center gap-2">
            
            {/* Refresh Button */}
            {onRefreshClick && (
              <button
                onClick={onRefreshClick}
                className="btn btn-sm btn-light btn-icon"
                disabled={loading}
                title="Refresh leads"
              >
                <i className={`bi bi-arrow-clockwise ${loading ? 'spinner-border spinner-border-sm' : ''}`}></i>
              </button>
            )}

            {/* Import Button */}
            {onImportClick && (
              <button
                onClick={onImportClick}
                className="btn btn-sm btn-light-primary"
                disabled={loading}
              >
                <i className="bi bi-upload me-1"></i>
                Import
              </button>
            )}

            {/* Export Button */}
            {onExportClick && (
              <button
                onClick={onExportClick}
                className="btn btn-sm btn-light-success"
                disabled={loading || totalLeads === 0}
              >
                <i className="bi bi-download me-1"></i>
                Export
              </button>
            )}

            {/* Add New Lead Button */}
            <button
              onClick={onAddClick}
              className="btn btn-sm btn-primary d-flex align-items-center gap-2"
              disabled={loading}
            >
              <i className="bi bi-plus-circle"></i>
              Add New Lead
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats Bar */}
      {headerStats.showStats && (
        <div className="card-body pt-0 border-top">
          <div className="row g-4">
            {/* Total Leads Card */}
            <div className="col-md-3">
              <div className="d-flex align-items-center">
                <div className="symbol symbol-40px me-3">
                  <div className="symbol-label bg-light-primary">
                    <i className="bi bi-people-fill text-primary fs-4"></i>
                  </div>
                </div>
                <div>
                  <div className="fs-6 text-muted">Total Leads</div>
                  <div className="fs-4 fw-bold text-gray-800">
                    {totalLeads.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            {/* Fresh Leads Card */}
            {stats.freshLeads !== undefined && (
              <div className="col-md-3">
                <div className="d-flex align-items-center">
                  <div className="symbol symbol-40px me-3">
                    <div className="symbol-label bg-light-success">
                      <i className="bi bi-lightning-charge text-success fs-4"></i>
                    </div>
                  </div>
                  <div>
                    <div className="fs-6 text-muted">Fresh Leads</div>
                    <div className="fs-4 fw-bold text-gray-800">
                      {stats.freshLeads.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Converted Leads Card */}
            {stats.convertedLeads !== undefined && (
              <div className="col-md-3">
                <div className="d-flex align-items-center">
                  <div className="symbol symbol-40px me-3">
                    <div className="symbol-label bg-light-info">
                      <i className="bi bi-check-circle-fill text-info fs-4"></i>
                    </div>
                  </div>
                  <div>
                    <div className="fs-6 text-muted">Converted</div>
                    <div className="fs-4 fw-bold text-gray-800">
                      {stats.convertedLeads.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Pending Follow-ups Card */}
            {stats.pendingFollowups !== undefined && (
              <div className="col-md-3">
                <div className="d-flex align-items-center">
                  <div className="symbol symbol-40px me-3">
                    <div className="symbol-label bg-light-warning">
                      <i className="bi bi-clock-history text-warning fs-4"></i>
                    </div>
                  </div>
                  <div>
                    <div className="fs-6 text-muted">Follow-ups</div>
                    <div className="fs-4 fw-bold text-gray-800">
                      {stats.pendingFollowups.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default LeadsHeader