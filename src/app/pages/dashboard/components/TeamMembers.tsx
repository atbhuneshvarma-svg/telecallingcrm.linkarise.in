import React from 'react'
import { DashboardStats } from '../../../modules/auth/core/_requests'

interface TeamMembersProps {
  stats: DashboardStats | null
  loading: boolean
}

export const TeamMembers: React.FC<TeamMembersProps> = ({ stats, loading }) => {
  const getActiveUsers = () => {
    if (!stats?.users) return 0
    return stats.users.filter(user => user.userstatus === 'Active').length
  }

  const activeUsers = stats?.users?.filter(user => user.userstatus === 'Active').slice(0, 5) || []

  return (
    <div className='card card-flush h-md-100'>
      <div className='card-header pt-7'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bold text-gray-800'>Team Members</span>
          <span className='text-gray-500 mt-1 fw-semibold fs-6'>Active team members ({getActiveUsers()})</span>
        </h3>
        <div className='card-toolbar'>
          <button className='btn btn-sm btn-light'>View All</button>
        </div>
      </div>
      <div className='card-body pt-5'>
        <div className='d-flex flex-column gap-4'>
          {loading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="d-flex align-items-center placeholder-glow">
                <div className="symbol symbol-50px me-4 placeholder"></div>
                <div className="flex-grow-1">
                  <div className="placeholder col-8 bg-secondary rounded mb-1" style={{height: '16px'}}></div>
                  <div className="placeholder col-6 bg-secondary rounded" style={{height: '14px'}}></div>
                </div>
              </div>
            ))
          ) : (
            activeUsers.map(user => (
              <div key={user.usermid} className='d-flex align-items-center'>
                <div className='symbol symbol-50px me-4'>
                  <div className='symbol-label bg-light-primary'>
                    <span className='fs-2x text-primary'>{user.username.charAt(0)}</span>
                  </div>
                </div>
                <div className='flex-grow-1'>
                  <span className='text-gray-800 fw-bold fs-6 d-block'>{user.username}</span>
                  <span className='text-gray-500 fw-semibold fs-7'>{user.userrole} • {user.usertype}</span>
                </div>
                <span className={`badge badge-sm badge-light-${user.userstatus === 'Active' ? 'success' : 'danger'}`}>
                  {user.userstatus}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}