import React from 'react'

interface RecentActivitiesProps {
  loading: boolean
}

export const RecentActivities: React.FC<RecentActivitiesProps> = ({ loading }) => {
  return (
    <div className='card card-flush h-md-100'>
      <div className='card-header pt-7'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bold text-gray-800'>Recent Activities</span>
          <span className='text-gray-500 mt-1 fw-semibold fs-6'>Latest lead interactions</span>
        </h3>
        <div className='card-toolbar'>
          <button className='btn btn-sm btn-light'>View All</button>
        </div>
      </div>
      <div className='card-body'>
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <div className="text-center py-5">
            <p className="text-muted">No recent activities to display</p>
          </div>
        )}
      </div>
    </div>
  )
}