import React, { useState } from 'react'
import { Lead } from '../core/_models'

interface Props {
  leads: Lead[]
  loading: boolean
  selectedLeads: number[]
  allSelected: boolean
  toggleLeadSelection: (leadId: number, checked: boolean) => void
  selectAllLeads: (checked: boolean) => void
}

type SortField = 'name' | 'phone' | 'email' | 'campaign' | 'status' | 'assigned' | 'details'
type SortDirection = 'asc' | 'desc'

const LeadTable: React.FC<Props> = ({
  leads,
  loading,
  selectedLeads,
  allSelected,
  toggleLeadSelection,
  selectAllLeads
}) => {
  const [sortField, setSortField] = useState<SortField>('name')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')

  // Inline CSS for text truncation
  const textTruncateStyle = `
    .text-truncate-ellipsis {
      display: inline-block;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 250px;
      vertical-align: middle;
    }
  `

  // Helper functions - MOVED UP before they are used
  const getDisplayName = (lead: Lead): string => lead.leadname || lead.name || 'Unnamed Lead'
  const getCampaignName = (lead: Lead): string => lead.campaign?.campaignname ?? 'No Campaign'
  const getStatusBadgeClass = (status?: string): string => {
    if (!status) return 'bg-secondary'
    switch (status.toLowerCase()) {
      case 'new': return 'bg-primary'
      case 'warm': return 'bg-warning'
      case 'hot': return 'bg-danger'
      case 'cold': return 'bg-info'
      case 'converted': return 'bg-success'
      case 'rejected': return 'bg-dark'
      default: return 'bg-secondary'
    }
  }

  // Handle sort
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Toggle direction if same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      // New field, default to ascending
      setSortField(field)
      setSortDirection('asc')
    }
  }

  // Sort leads
  const sortedLeads = [...leads].sort((a, b) => {
    let aValue: any = ''
    let bValue: any = ''

    switch (sortField) {
      case 'name':
        aValue = getDisplayName(a).toLowerCase()
        bValue = getDisplayName(b).toLowerCase()
        break
      case 'phone':
        aValue = a.phone || ''
        bValue = b.phone || ''
        break
      case 'email':
        aValue = a.email || ''
        bValue = b.email || ''
        break
      case 'campaign':
        aValue = getCampaignName(a).toLowerCase()
        bValue = getCampaignName(b).toLowerCase()
        break
      case 'status':
        aValue = a.statusname || ''
        bValue = b.statusname || ''
        break
      case 'assigned':
        aValue = a.username || ''
        bValue = b.username || ''
        break
      case 'details':
        aValue = a.detail || ''
        bValue = b.detail || ''
        break
      default:
        return 0
    }

    // Handle empty values
    if (!aValue && !bValue) return 0
    if (!aValue) return sortDirection === 'asc' ? -1 : 1
    if (!bValue) return sortDirection === 'asc' ? 1 : -1

    // Compare values
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
    return 0
  })

  // Sort indicator component
  const SortIndicator: React.FC<{ field: SortField }> = ({ field }) => {
    if (sortField !== field) {
      return <i className="bi bi-arrow-down-up ms-1 text-muted small"></i>
    }
    
    return sortDirection === 'asc' 
      ? <i className="bi bi-arrow-up ms-1 text-primary small"></i>
      : <i className="bi bi-arrow-down ms-1 text-primary small"></i>
  }

  // Sortable header component
  const SortableHeader: React.FC<{ 
    field: SortField
    children: React.ReactNode
    className?: string
  }> = ({ field, children, className = '' }) => (
    <th 
      className={`${className} cursor-pointer user-select-none`}
      onClick={() => handleSort(field)}
      style={{ cursor: 'pointer' }}
    >
      <div className="d-flex align-items-center">
        {children}
        <SortIndicator field={field} />
      </div>
    </th>
  )

  // Show loading state
  if (loading) {
    return (
      <div className="card shadow-sm">
        <div className="card-body text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <div className="mt-2">Loading leads...</div>
        </div>
      </div>
    )
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: textTruncateStyle }} />
      <div className="card shadow-sm">
        <div className="card-body p-0">
          <div className="table-responsive px-3 mx-3">
            <table className="table table-hover table-striped table-sm mb-0 align-middle">
              <thead className="table-light">
                <tr>
                  <th style={{ width: '40px' }}>
                    <input
                      type="checkbox"
                      className="form-check-input"
                      checked={allSelected}
                      onChange={(e) => selectAllLeads(e.target.checked)}
                      disabled={leads.length === 0}
                    />
                  </th>
                  
                  <SortableHeader field="name">
                    Name
                  </SortableHeader>
                  
                  <SortableHeader field="phone">
                    Phone
                  </SortableHeader>
                  
                  <SortableHeader field="email">
                    Email
                  </SortableHeader>
                  
                  <SortableHeader field="campaign">
                    Campaign
                  </SortableHeader>
                  
                  <SortableHeader field="status">
                    Status
                  </SortableHeader>
                  
                  <SortableHeader field="assigned">
                    Assigned To
                  </SortableHeader>
                  
                  <SortableHeader field="details">
                    Details
                  </SortableHeader>
                </tr>
              </thead>

              <tbody>
                {sortedLeads.length > 0 ? (
                  sortedLeads.map((lead) => (
                    <tr key={lead.leadmid} className={selectedLeads.includes(lead.leadmid) ? 'table-active' : ''}>
                      <td>
                        <input
                          type="checkbox"
                          className="form-check-input"
                          checked={selectedLeads.includes(lead.leadmid)}
                          onChange={(e) => toggleLeadSelection(lead.leadmid, e.target.checked)}
                        />
                      </td>

                      <td className="fw-semibold">{getDisplayName(lead)}</td>

                      <td>
                        {lead.phone ? (
                          <a href={`tel:${lead.phone}`} className="text-decoration-none">
                            {lead.phone}
                          </a>
                        ) : <span className="text-muted">-</span>}
                      </td>

                      <td>
                        {lead.email ? (
                          <a href={`mailto:${lead.email}`} className="text-decoration-none">
                            {lead.email}
                          </a>
                        ) : <span className="text-muted">-</span>}
                      </td>

                      <td>
                        <span className="badge bg-light text-dark">
                          {getCampaignName(lead)}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`badge ${getStatusBadgeClass(lead.statusname)}`}
                          style={lead.statuscolor ? { backgroundColor: lead.statuscolor } : {}}
                        >
                          {lead.statusname || 'Unknown'}
                        </span>
                      </td>

                      <td>
                        <span className={lead.username ? '' : 'text-muted'}>
                          {lead.username || 'Unassigned'}
                        </span>
                      </td>

                      <td title={lead.detail || ''}>
                        <span className="text-truncate-ellipsis">
                          {lead.detail
                            ? lead.detail.length > 50
                              ? `${lead.detail.substring(0, 50)}...`
                              : lead.detail
                            : '-'}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="text-center py-4 text-muted">
                      <div className="d-flex flex-column align-items-center">
                        <i className="bi bi-inbox fs-1 text-muted mb-2"></i>
                        <div>No leads found</div>
                        <small className="text-muted">
                          Try adjusting your filters or importing some leads
                        </small>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Sort info footer */}
          {sortedLeads.length > 0 && (
            <div className="card-footer bg-transparent border-top-0">
              <div className="d-flex justify-content-between align-items-center">
                <small className="text-muted">
                  Showing {sortedLeads.length} leads
                </small>
                <small className="text-muted">
                  Sorted by: <span className="fw-semibold text-capitalize">{sortField}</span> 
                  <i className={`bi bi-arrow-${sortDirection === 'asc' ? 'up' : 'down'} ms-1`}></i>
                </small>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default LeadTable