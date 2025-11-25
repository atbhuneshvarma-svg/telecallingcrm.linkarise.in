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

  const convertedClients = stats?.recentConfirmed ?? []

  return (
    <div className="table-responsive">
      {convertedClients.length > 0 ? (
        <table className="table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4">
          <thead>
            <tr className="fw-bold text-muted">
              <th>Name</th>
              <th>Phone</th>
              <th>Stage Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {convertedClients.map((lead) => (
              <tr key={lead.leadmid}>
                <td>{lead.name}</td>
                <td>{lead.phone}</td>
                <td>{new Date(lead.stagedate).toLocaleString()}</td>
                <td>{lead.stage}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className='text-muted'>No recent converted</p>
      )}
    </div>
  )
}

export default ConvertedClientsTable
