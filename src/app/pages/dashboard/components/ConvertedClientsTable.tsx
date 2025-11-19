import React from 'react'
import {convertedLeadService } from '../../../modules/apps/reports/converted/core/services/leadService'
interface ConvertedClientsTableProps {
  stats?: any
  loading?: boolean
}

const fetchConvertedClients = async () => {
  try {
    const response = await convertedLeadService.getConvertedLeads({ page: 1, per_page: 5 })
    return response.data
  } catch (error) {
    console.error('Error fetching converted clients:', error)
    return []
  }
}

const convertedClients = await fetchConvertedClients()

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

  return (
    <div className="table-responsive">
      <table className="table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4">
        <thead>
          <tr className="fw-bold text-muted">
            <th className="min-w-200px">Name</th>
            <th className="min-w-120px">Mobile</th>
            <th className="min-w-120px">Telecaller</th>
            <th className="min-w-120px">Campaign</th>
            <th className="min-w-100px">Date</th>
          </tr>
        </thead>
        <tbody>
          {convertedClients.map((client: any, index: number) => (
            <tr key={index}>
              <td>
                <span className="text-dark fw-bold text-hover-primary d-block fs-6">
                  {client.name}
                </span>
              </td>
              <td>
                <span className="text-dark fw-bold d-block fs-6">
                  {client.mobile}
                </span>
              </td>
              <td>
                <span className="text-dark fw-bold d-block fs-6">
                  {client.telecaller}
                </span>
              </td>
              <td>
                <span className="text-dark fw-bold d-block fs-6">
                  {client.campaign}
                </span>
              </td>
              <td>
                <span className="text-dark fw-bold d-block fs-6">
                  {client.date}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ConvertedClientsTable