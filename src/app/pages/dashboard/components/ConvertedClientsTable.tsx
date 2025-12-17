import React from 'react'
import { DashboardStats } from '../../../modules/auth/core/_models'

interface ConvertedClientsTableProps {
  stats?: DashboardStats | null
  loading?: boolean
}

const ConvertedClientsTable: React.FC<ConvertedClientsTableProps> = ({ stats, loading }) => {
  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  // Use performanceTop5 data for the telecaller performance table
  const performanceData = stats?.performanceTop5 ?? []

  return (
    <div className="table-responsive">
      {performanceData.length > 0 ? (
        <table className="table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4">
          <thead>
            <tr className="fw-bold text-muted bg-light">
              <th className="ps-4">User</th>
              <th>Total Leads</th>
              <th>Fresh Leads</th>
              <th>Dialed</th>
              <th>Answered</th>
              <th>Interested</th>
              <th>Converted</th>
              <th>Not Interested</th>
              <th className="pe-4">Call Duration</th>
            </tr>
          </thead>
          <tbody>
            {performanceData.map((user, index) => (
              <tr key={user.username || index}>
                <td className="ps-4">
                  <div className="d-flex align-items-center">
                    <div className="symbol symbol-40px symbol-circle me-3">
                      <div className="symbol-label bg-light-primary">
                        <span className="text-primary fw-bold fs-6">
                          {user.username?.charAt(0)?.toUpperCase() || 'U'}
                        </span>
                      </div>
                    </div>
                    <div className="d-flex justify-content-start flex-column">
                      <span className="fw-bold text-dark fs-6">{user.username}</span>
                    </div>
                  </div>
                </td>
                <td>
                  <span className="text-dark fw-bold fs-6">
                    {user.totalLeads?.toLocaleString() || 0}
                  </span>
                </td>
                <td>
                  <span className="text-primary fw-semibold fs-6">
                    {user.freshLeads?.toLocaleString() || 0}
                  </span>
                </td>
                <td>
                  <span className="text-dark fw-semibold fs-6">
                    {user.dialCall?.toLocaleString() || 0}
                  </span>
                </td>
                <td>
                  <span className="text-success fw-semibold fs-6">
                    {user.ansCall?.toLocaleString() || 0}
                  </span>
                </td>
                <td>
                  <span className="text-info fw-semibold fs-6">
                    {user.interested?.toLocaleString() || 0}
                  </span>
                </td>
                <td>
                  <span className="text-success fw-bold fs-6">
                    {user.converted_to_client?.toLocaleString() || 0}
                  </span>
                </td>
                <td>
                  <span className="text-danger fw-semibold fs-6">
                    {user.notinterested?.toLocaleString() || 0}
                  </span>
                </td>
                <td className="pe-4">
                  <span className="text-muted fw-semibold fs-7">
                    {user.callDuration || '00:00'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="text-center py-8">
          <i className="bi bi-graph-up display-1 text-muted opacity-50"></i>
          <p className="text-muted mt-3">No performance data available</p>
        </div>
      )}
    </div>
  )
}

export default ConvertedClientsTable