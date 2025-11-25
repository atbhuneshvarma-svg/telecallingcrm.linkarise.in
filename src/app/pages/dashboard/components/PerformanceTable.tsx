import React from 'react'
import { DashboardStats } from '../../../modules/auth/core/_models'

export interface PerformanceTableProps {
  stats: DashboardStats | null
  loading: boolean
}

export const PerformanceTable: React.FC<PerformanceTableProps> = ({ stats, loading }) => {
  // --------------------------------------
  // Loading State
  // --------------------------------------
  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  // --------------------------------------
  // Make performanceTop5 fully dynamic
  // --------------------------------------
  const performanceData = Array.isArray(stats?.performanceTop5)
    ? stats!.performanceTop5.map((item) => ({
        username: item?.username ?? 'Unknown',
        dialCall: item?.dialCall ?? 0,
        ansCall: item?.ansCall ?? 0,
        converted: item?.converted ?? 0,
        callDuration: item?.callDuration ?? 0,
      }))
    : []

  // --------------------------------------
  // Empty State UI
  // --------------------------------------
  if (performanceData.length === 0) {
    return (
      <div className="text-center py-5 text-muted fs-6">
        No performance data available
      </div>
    )
  }

  // --------------------------------------
  // UI
  // --------------------------------------
  return (
    <div className="table-responsive">
      <table className="table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4">
        <thead>
          <tr className="fw-bold text-muted">
            <th className="min-w-150px">Telecaller</th>
            <th className="min-w-100px">Dial Calls</th>
            <th className="min-w-100px">Answered</th>
            <th className="min-w-100px">Converted</th>
            <th className="min-w-120px">Call Duration</th>
          </tr>
        </thead>

        <tbody>
          {performanceData.map((item, index) => (
            <tr key={index}>
              <td>
                <span className="text-dark fw-bold text-hover-primary d-block fs-6">
                  {item.username}
                </span>
              </td>

              <td>
                <span className="text-dark fw-bold d-block fs-6">
                  {item.dialCall}
                </span>
              </td>

              <td>
                <span className="text-dark fw-bold d-block fs-6">
                  {item.ansCall}
                </span>
              </td>

              <td>
                <span className="text-dark fw-bold d-block fs-6">
                  {item.converted}
                </span>
              </td>

              <td>
                <span className="text-dark fw-bold d-block fs-6">
                  {item.callDuration} sec
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
