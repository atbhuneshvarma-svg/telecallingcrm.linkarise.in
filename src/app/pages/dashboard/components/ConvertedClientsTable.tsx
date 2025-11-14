import React from 'react'

interface ConvertedClientsTableProps {
  stats?: any
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

  const convertedClients = [
    { name: 'ABITHA ABRAHAM', mobile: '8129150209', telecaller: 'manu', campaign: 'testreport', date: '2025-T' },
    { name: 'VIJAYANPILLAI G', mobile: '8547404662', telecaller: 'manu', campaign: 'testreport', date: '2025-T' },
    { name: 'ASHNA NOUSHAD', mobile: '9447421357', telecaller: 'Counsellor', campaign: 'Campaign', date: '2025-T' },
    { name: 'KRISHNA KIRKELER', mobile: '7306249490', telecaller: 'Telecaller', campaign: 'Campaign', date: '2025-T' },
    { name: 'KRISHNA KIRKELER', mobile: '7306249490', telecaller: 'Telecaller', campaign: 'Campaign', date: '2025-T' }
  ]

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