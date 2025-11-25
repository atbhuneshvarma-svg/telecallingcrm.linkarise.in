import React from 'react'
import { DashboardStats } from '../../../modules/auth/core/_models'

interface TeamMembersProps {
  stats: DashboardStats | null
  loading: boolean
}

export const TeamMembers: React.FC<TeamMembersProps> = ({ stats, loading }) => {

  // -----------------------------
  // Build dynamic team members list
  // -----------------------------
  const teamMembers = Array.isArray(stats?.performanceTop5)
    ? stats!.performanceTop5.slice(0, 5).map((u) => ({
        username: u.username ?? "Unknown",
        dialCall: u.dialCall ?? 0,
        ansCall: u.ansCall ?? 0,
        converted: u.converted ?? 0,
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
          <button className='btn btn-sm btn-light'>View All</button>
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
                  <span className='fs-2x text-primary'>
                    {member.username.charAt(0)}
                  </span>
                </div>
              </div>

              <div className='flex-grow-1'>
                <span className='text-gray-800 fw-bold fs-6 d-block'>
                  {member.username}
                </span>

                <span className='text-gray-500 fw-semibold fs-7'>
                  {member.dialCall} Dial • {member.ansCall} Answered • {member.converted} Converted
                </span>
              </div>

              <span className="badge badge-sm badge-light-success">
                Active
              </span>
            </div>
          ))}

          {/* EMPTY STATE */}
          {!loading && teamMembers.length === 0 && (
            <div className="text-muted text-center fs-7 py-5">
              No team member data found
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
