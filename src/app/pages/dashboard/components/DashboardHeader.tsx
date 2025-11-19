import React from 'react'
import { getTodayTelecallerPerformance } from '../../../modules/apps/reports/performance/core/_requests'
// In DashboardHeader component file
export interface DashboardHeaderProps {
  error: string | null
  loading: boolean
  onRefresh: () => void
  onClearError: () => void
  lastUpdated?: Date | null // Make this optional if it wasn't there before
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  error,
  loading,
  onRefresh,
  onClearError
}) => {
  return (
    <div className="d-flex justify-content-between align-items-center mb-5">
      <div>
        <h1 className="h3 text-gray-800 mb-1">Dashboard Overview</h1>
        
        {error && (
          <div className="alert alert-warning alert-dismissible fade show mt-2 py-2" role="alert">
            <i className="bi bi-exclamation-triangle me-2"></i>
            {error}
            <button 
              type="button" 
              className="btn-close btn-close-sm" 
              onClick={onClearError}
            ></button>
          </div>
        )}
      </div>
      <button 
        className="btn btn-sm btn-light-primary d-flex align-items-center gap-2"
        onClick={onRefresh}
        disabled={loading}
      >
        <i className={`bi bi-arrow-clockwise ${loading ? 'spin' : ''}`}></i>
        {loading ? 'Refreshing...' : 'Refresh Data'}
      </button>
    </div>
  )
}