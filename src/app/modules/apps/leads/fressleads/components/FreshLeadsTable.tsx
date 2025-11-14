// components/FreshLeadsTable.tsx
import React from 'react'
import { FreshLead } from '../core/_models'

interface FreshLeadsTableProps {
  leads: FreshLead[]
  isLoading: boolean
  currentPage: number
  perPage: number
  onViewClick?: (lead: FreshLead) => void
  onEditClick?: (lead: FreshLead) => void
  onStatusClick?: (lead: FreshLead) => void
  showSearch?: boolean
  onSearch?: (searchTerm: string) => void
  searchTerm?: string
  totalRecords?: number
  showingFrom?: number
  showingTo?: number
  onEntriesPerPageChange?: (perPage: number) => void
}

export const FreshLeadsTable: React.FC<FreshLeadsTableProps> = ({
  leads,
  isLoading,
  currentPage,
  perPage,
  onViewClick,
  onEditClick,
  onStatusClick,
  showSearch = true,
  onSearch,
  searchTerm = '',
  totalRecords = 0,
  showingFrom = 0,
  showingTo = 0,
  onEntriesPerPageChange,
}) => {
  const [localSearchTerm, setLocalSearchTerm] = React.useState(searchTerm)

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setLocalSearchTerm(value)
    if (onSearch) {
      onSearch(value)
    }
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (onSearch) {
      onSearch(localSearchTerm)
    }
  }

  const handleSearchClear = () => {
    setLocalSearchTerm('')
    if (onSearch) {
      onSearch('')
    }
  }

  const handleEntriesChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const perPageValue = Number(e.target.value)
    onEntriesPerPageChange?.(perPageValue)
  }

  const getTimeAgo = (dateString: string) => {
    const created = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - created.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    return created.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusColor = (statusname: string, statuscolor?: string) => {
    return statuscolor || '#6c757d'
  }

  // Filter leads based on search term
  const filteredLeads = React.useMemo(() => {
    if (!localSearchTerm || onSearch) {
      return leads
    }

    const searchLower = localSearchTerm.toLowerCase()
    return leads.filter(lead => 
      (lead.name?.toLowerCase().includes(searchLower)) ||
      (lead.email?.toLowerCase().includes(searchLower)) ||
      (lead.phone?.toLowerCase().includes(searchLower)) ||
      (lead.campaign?.campaignname?.toLowerCase().includes(searchLower)) ||
      (lead.sourceofinquiry?.toLowerCase().includes(searchLower)) ||
      false
    )
  }, [leads, localSearchTerm, onSearch])

  const displayLeads = onSearch ? leads : filteredLeads

  if (isLoading) {
    return (
      <div className="card">
        <div className="card-body p-0">
          <div className="text-center p-8">
            <div className="spinner-border text-primary mb-3" role="status">
              <span className="visually-hidden">Loading fresh leads...</span>
            </div>
            <p className="text-muted">Loading today's fresh leads...</p>
          </div>
        </div>
      </div>
    )
  }

  if (displayLeads.length === 0) {
    return (
      <div className="card">
        <div className="card-body p-0">
          <div className="text-center py-8">
            <div className="mb-4">
              <i className="bi bi-inbox display-1 text-muted opacity-50"></i>
            </div>
            <h5 className="text-muted mb-2">
              {localSearchTerm ? 'No matching fresh leads found' : 'No fresh leads for today'}
            </h5>
            <p className="text-muted mb-4">
              {localSearchTerm 
                ? 'Try adjusting your search terms' 
                : 'Leads created today will appear here automatically'
              }
            </p>
            {localSearchTerm && (
              <button 
                className="btn btn-primary"
                onClick={handleSearchClear}
              >
                <i className="bi bi-arrow-clockwise me-2"></i>
                Clear Search
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="card-body p-0">
        {/* Header Controls */}
        <div className="border-bottom bg-light">
          <div className="row align-items-center px-4 py-3">
            {/* Left Side: Table Controls */}
            <div className="col-md-6 p-5">
              <div className="d-flex align-items-center gap-3">
                <div className="d-flex align-items-center gap-2">
                  <span className="text-muted fw-medium">Show</span>
                  <select
                    value={perPage}
                    onChange={handleEntriesChange}
                    className="form-select form-select-sm w-auto border-primary"
                    disabled={isLoading}
                  >
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                  </select>
                  <span className="text-muted fw-medium">entries</span>
                </div>
                
              </div>
            </div>

            {/* Right Side: Search Bar */}
            {showSearch && (
              <div className="col-md-6">
                <div className="d-flex justify-content-end">
                  <form onSubmit={handleSearchSubmit} className="w-100" style={{ maxWidth: '400px' }}>
                    <div className="input-group input-group-sm">
                      <span className="input-group-text bg-white border-end-0">
                        <i className="bi bi-search text-muted"></i>
                      </span>
                      <input
                        type="text"
                        value={localSearchTerm}
                        onChange={handleSearchChange}
                        className="form-control border-start-0"
                        placeholder="Search fresh leads by name, phone, email..."
                        disabled={isLoading}
                      />
                      {localSearchTerm && (
                        <button
                          type="button"
                          className="btn btn-outline-secondary border"
                          onClick={handleSearchClear}
                          disabled={isLoading}
                          title="Clear search"
                        >
                          <i className="bi bi-x-lg"></i>
                        </button>
                      )}
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>

          {/* Search Results Info */}
          {showSearch && localSearchTerm && (
            <div className="px-4 py-2 bg-info bg-opacity-10 border-top">
              <div className="row align-items-center">
                <div className="col-12">
                  <div className="d-flex align-items-center gap-2 fs-8">
                    <i className="bi bi-info-circle text-info"></i>
                    <span className="text-muted">
                      Found <strong className="text-dark">{displayLeads.length}</strong> fresh lead{displayLeads.length !== 1 ? 's' : ''} 
                      {leads.length !== displayLeads.length && (
                        <span> (filtered from <strong>{leads.length}</strong> total leads)</span>
                      )}
                    </span>
                    {localSearchTerm && (
                      <button 
                        className="btn btn-sm btn-link p-0 ms-2 text-decoration-none"
                        onClick={handleSearchClear}
                      >
                        Clear search
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Table */}
        <div className="table-responsive">
          <table className="table table-hover align-middle gs-0 gy-2">
            <thead className="bg-light">
              <tr>
                <th className="ps-4" style={{ width: '60px' }}>
                  <span className="text-muted fw-semibold fs-7">#</span>
                </th>
                <th className="min-w-150px">
                  <span className="text-muted fw-semibold fs-7">Lead Information</span>
                </th>
                <th className="min-w-130px">
                  <span className="text-muted fw-semibold fs-7">Contact Info</span>
                </th>
                <th className="min-w-120px">
                  <span className="text-muted fw-semibold fs-7">Campaign</span>
                </th>
                <th className="min-w-100px">
                  <span className="text-muted fw-semibold fs-7">Source</span>
                </th>
                <th className="min-w-100px">
                  <span className="text-muted fw-semibold fs-7">Purpose</span>
                </th>
                <th className="min-w-120px text-center">
                  <span className="text-muted fw-semibold fs-7">Status</span>
                </th>
                <th className="min-w-120px">
                  <span className="text-muted fw-semibold fs-7">Assigned To</span>
                </th>
                <th className="min-w-100px">
                  <span className="text-muted fw-semibold fs-7">Activity</span>
                </th>
                <th className="min-w-100px">
                  <span className="text-muted fw-semibold fs-7">Created</span>
                </th>
                {(onViewClick || onEditClick || onStatusClick) && (
                  <th className="pe-4 text-center" style={{ width: '120px' }}>
                    <span className="text-muted fw-semibold fs-7">Actions</span>
                  </th>
                )}
              </tr>
            </thead>
            
            <tbody className="border-top-0">
              {displayLeads.map((lead, index) => (
                <tr key={lead.leadmid} className="lead-row">
                  {/* Row Number */}
                  <td className="ps-4">
                    <span className="text-muted fs-8 fw-medium">
                      {(currentPage - 1) * perPage + index + 1}
                    </span>
                  </td>
                  
                  {/* Lead Information */}
                  <td>
                    <div className="d-flex align-items-center">
                      <div className="symbol symbol-45px me-3">
                        <div className="symbol-label bg-light-primary">
                          <span className="text-primary fw-bold fs-6">
                            {lead.name
                              ?.split(' ')
                              .map((n) => n[0])
                              .join('')
                              .toUpperCase() || 'L'}
                          </span>
                        </div>
                      </div>
                      <div className="d-flex flex-column">
                        <span
                          className="fw-bold text-dark cursor-pointer hover-primary text-hover-primary"
                          onClick={() => onViewClick?.(lead)}
                          style={{ cursor: onViewClick ? 'pointer' : 'default' }}
                        >
                          {lead.name || 'Unnamed Lead'}
                        </span>
                        {lead.address && (
                          <div className="text-muted fs-8 mt-1 d-flex align-items-center gap-1">
                            <i className="bi bi-geo-alt"></i>
                            {lead.address.substring(0, 35)}...
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  
                  {/* Contact Information */}
                  <td>
                    <div className="d-flex flex-column gap-1">
                      {lead.phone && (
                        <div className="d-flex align-items-center gap-1">
                          <i className="bi bi-telephone text-muted fs-8"></i>
                          <a 
                            href={`tel:${lead.phone}`}
                            className="text-gray-700 text-decoration-none fs-8"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {lead.phone}
                          </a>
                        </div>
                      )}
                      {lead.email && (
                        <div className="d-flex align-items-center gap-1">
                          <i className="bi bi-envelope text-muted fs-8"></i>
                          <a
                            href={`mailto:${lead.email}`}
                            className="text-primary text-decoration-none fs-8 text-truncate"
                            onClick={(e) => e.stopPropagation()}
                            style={{ maxWidth: '150px' }}
                          >
                            {lead.email}
                          </a>
                        </div>
                      )}
                      {!lead.phone && !lead.email && (
                        <span className="text-muted fs-8">No contact info</span>
                      )}
                    </div>
                  </td>
                  
                  {/* Campaign */}
                  <td>
                    <span className="badge badge-light-info fs-8 px-3 py-2">
                      <i className="bi bi-megaphone me-1"></i>
                      {lead.campaign?.campaignname || 'N/A'}
                    </span>
                  </td>
                  
                  {/* Source */}
                  <td>
                    <small className="text-muted">{lead.sourceofinquiry || 'N/A'}</small>
                  </td>
                  
                  {/* Purpose */}
                  <td>
                    <small className="text-muted">{lead.purpose || 'N/A'}</small>
                  </td>
                  
                  {/* Status */}
                  <td className="text-center">
                    <button
                      className="btn btn-status border-0 bg-transparent p-0 transition-all"
                      onClick={() => onStatusClick?.(lead)}
                      style={{ cursor: onStatusClick ? 'pointer' : 'default' }}
                      disabled={isLoading}
                      title={onStatusClick ? "Click to change status" : "Status"}
                    >
                      <span
                        className="badge rounded-pill fw-semibold d-inline-flex align-items-center gap-2 px-3 py-2 transition-all"
                        style={{
                          backgroundColor: getStatusColor(lead.statusname, lead.statuscolor),
                          color: '#fff',
                          minWidth: '110px',
                          fontSize: '0.75rem',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}
                      >
                        {lead.statusname || 'N/A'}
                        {onStatusClick && <i className="bi bi-pencil fs-9 opacity-75"></i>}
                      </span>
                    </button>
                  </td>
                  
                  {/* Assigned To */}
                  <td>
                    <div className="d-flex align-items-center">
                      <div className="d-flex flex-column">
                        <span className="fw-semibold text-gray-800">
                          {lead.user?.username || 'Unassigned'}
                        </span>
                      </div>
                    </div>
                  </td>
                  
                  {/* Activity */}
                  <td>
                    <span className="text-muted fs-8">
                      {lead.activityname || 'No activity'}
                    </span>
                  </td>
                  
                  {/* Created */}
                  <td>
                    <div className="d-flex flex-column">
                      <span className="text-muted fs-8">
                        {getTimeAgo(lead.created_at)}
                      </span>
                    </div>
                  </td>
                  
                  {/* Actions */}
                  {(onViewClick || onEditClick || onStatusClick) && (
                    <td className="pe-4 text-center">
                      <div className="d-flex justify-content-center gap-1">
                        {onViewClick && (
                          <button
                            className="btn btn-sm btn-icon btn-light-primary btn-hover-scale"
                            onClick={() => onViewClick(lead)}
                            disabled={isLoading}
                            title="View lead details"
                          >
                            <i className="bi bi-eye-fill fs-6"></i>
                          </button>
                        )}
                        {onEditClick && (
                          <button
                            className="btn btn-sm btn-icon btn-light-warning btn-hover-scale"
                            onClick={() => onEditClick(lead)}
                            disabled={isLoading}
                            title="Edit lead"
                          >
                            <i className="bi bi-pencil-fill fs-6"></i>
                          </button>
                        )}
                        {onStatusClick && (
                          <button
                            className="btn btn-sm btn-icon btn-light-info btn-hover-scale"
                            onClick={() => onStatusClick(lead)}
                            disabled={isLoading}
                            title="Change status"
                          >
                            <i className="bi bi-arrow-repeat fs-6"></i>
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}