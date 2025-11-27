import React from 'react'
import { useNavigate } from 'react-router-dom'
import { DashboardStats } from '../../../modules/auth/core/_models'

interface TeamMembersProps {
  stats: DashboardStats | null
  loading: boolean
}

export const TeamMembers: React.FC<TeamMembersProps> = ({ stats, loading }) => {
  const navigate = useNavigate()

  const handleViewAll = () => {
    navigate('/manage/user-management/users')
  }

  // -----------------------------
  // Build dynamic team members list
  // -----------------------------
  const teamMembers = Array.isArray(stats?.performanceTop5)
    ? stats!.performanceTop5.slice(0, 5).map((u) => ({
        username: u.username ?? "Unknown",
        dialCall: u.dialCall ?? 0,
        ansCall: u.ansCall ?? 0,
        converted: u.converted_to_client ?? 0, // Fixed: use converted_to_client
        interested: u.interested ?? 0,
        notinterested: u.notinterested ?? 0,
      }))
    : []

  // -----------------------------
  // UI
  // -----------------------------
  return (
    <div className='card card-flush h-md-100'>
      <div className='card-header pt-7'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bold text-gray-800'>Team Members</span>
          <span className='text-gray-500 mt-1 fw-semibold fs-6'>
            Top 5 Telecallers
          </span>
        </h3>

        <div className='card-toolbar'>
          <button 
            className='btn btn-sm btn-light'
            onClick={handleViewAll}
          >
            View All
          </button>
        </div>
      </div>

      <div className='card-body pt-5'>
        <div className='d-flex flex-column gap-4'>
          
          {/* LOADING SKELETON */}
          {loading && (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="d-flex align-items-center placeholder-glow">
                <div className="symbol symbol-50px me-4 placeholder"></div>
                <div className="flex-grow-1">
                  <div className="placeholder col-8 bg-secondary rounded mb-1" style={{ height: '16px' }}></div>
                  <div className="placeholder col-6 bg-secondary rounded" style={{ height: '14px' }}></div>
                </div>
              </div>
            ))
          )}

          {/* ACTUAL DATA */}
          {!loading && teamMembers.length > 0 && teamMembers.map((member, index) => (
            <div key={index} className='d-flex align-items-center'>
              
              <div className='symbol symbol-50px me-4'>
                <div className='symbol-label bg-light-primary'>
                  <span className='fs-2x text-primary fw-bold'>
                    {member.username?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
              </div>

              <div className='flex-grow-1'>
                <span className='text-gray-800 fw-bold fs-6 d-block'>
                  {member.username}
                </span>

                <div className='d-flex gap-2 text-gray-500 fw-semibold fs-7'>
                  <span className='badge badge-light-primary'>{member.dialCall} Dialed</span>
                  <span className='badge badge-light-success'>{member.ansCall} Answered</span>
                  <span className='badge badge-light-info'>{member.interested} Interested</span>
                  <span className='badge badge-light-success'>{member.converted} Converted</span>
                </div>
              </div>

              <span className="badge badge-sm badge-light-success">
                Active
              </span>
            </div>
          ))}

          {/* EMPTY STATE */}
          {!loading && teamMembers.length === 0 && (
            <div className="text-muted text-center fs-7 py-5">
              <i className="bi bi-people display-4 opacity-50 d-block mb-2"></i>
              No team member data found
            </div>
          )}

        </div>
      </div>
    </div>
  )
}