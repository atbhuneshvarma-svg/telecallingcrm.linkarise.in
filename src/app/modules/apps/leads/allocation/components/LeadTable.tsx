import React from 'react'
import { Lead } from '../core/_models'

interface Props {
  leads: Lead[]
  loading: boolean
  selectedLeads: number[]
  allSelected: boolean
  toggleLeadSelection: (leadId: number, checked: boolean) => void
  selectAllLeads: (checked: boolean) => void
}

const LeadTable: React.FC<Props> = ({
  leads,
  loading,
  selectedLeads,
  allSelected,
  toggleLeadSelection,
  selectAllLeads
}) => {
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

  // Helpers
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

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: textTruncateStyle }} />
      <div className="card shadow-sm">
        <div className="card-body p-0">
          <div className="table-responsive px-3 mx-3  ">
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
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>Campaign</th>
                  <th>Status</th>
                  <th>Assigned To</th>
                  <th>Details</th>
                </tr>
              </thead>

              <tbody>
                {leads.length > 0 ? (
                  leads.map((lead) => (
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

        </div>
      </div>
    </>
  )
}

export default LeadTable
