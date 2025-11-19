import React from 'react'
import { DashboardStats } from '../../../modules/auth/core/_requests'

// In PerformanceTable component file
export interface PerformanceTableProps {
  stats: DashboardStats | null
  loading: boolean
  telecallerPerformance?: any // Add this prop
}

export const PerformanceTable: React.FC<PerformanceTableProps> = ({ stats, loading }) => {
  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  const performanceData = stats?.performance || [
    { telecaller: 'bhunu', dialCalls: 0, answered: 0, converted: 0, callDuration: '00:00:00' },
    { telecaller: 'abc', dialCalls: 0, answered: 0, converted: 0, callDuration: '00:00:00' },
    { telecaller: 'Counsellor', dialCalls: 0, answered: 0, converted: 0, callDuration: '00:00:00' },
    { telecaller: 'Telecaller', dialCalls: 0, answered: 0, converted: 0, callDuration: '00:00:00' },
    { telecaller: 'bhunesh', dialCalls: 0, answered: 0, converted: 0, callDuration: '00:00:00' }
  ]

  return (
    <div className="table-responsive">
      <table className="table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4">
        <thead>
          <tr className="fw-bold text-muted">
            <th className="min-w-150px">Telecaller</th>
            <th className="min-w-100px">Dial Calls</th>
            <th className="min-w-100px">Answered</th>
            <th className="min-w-100px">Converted</th>
            <th className="min-w-120px">CallDuration</th>
          </tr>
        </thead>
        <tbody>
          {performanceData.map((item: any, index: number) => (
            <tr key={index}>
              <td>
                <span className="text-dark fw-bold text-hover-primary d-block fs-6">
                  {item.telecaller}
                </span>
              </td>
              <td>
                <span className="text-dark fw-bold d-block fs-6">
                  {item.dialCalls}
                </span>
              </td>
              <td>
                <span className="text-dark fw-bold d-block fs-6">
                  {item.answered}
                </span>
              </td>
              <td>
                <span className="text-dark fw-bold d-block fs-6">
                  {item.converted}
                </span>
              </td>
              <td>
                <span className="text-dark fw-bold d-block fs-6">
                  {item.callDuration}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}