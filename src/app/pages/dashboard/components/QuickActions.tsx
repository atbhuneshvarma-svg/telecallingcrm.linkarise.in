import React from 'react'
import { DashboardStats } from '../../../modules/auth/core/_requests'

interface QuickActionsProps {
  stats: DashboardStats | null
  loading: boolean
}

export const QuickActions: React.FC<QuickActionsProps> = ({ stats, loading }) => {
  const getPendingFollowups = () => {
    if (!stats?.leadscalltodaypf) return 0
    let pending = 0
    Object.values(stats.leadscalltodaypf).forEach(userCalls => {
      userCalls.forEach(call => {
        if (call.followup === 1) {
          pending++
        }
      })
    })
    return pending
  }

  const actions = [
    {
      title: 'Process Fresh Leads',
      icon: 'bi-lightning-charge',
      color: 'primary',
      href: '/telecallingcrm.linkarise.in/leads/freshleads',
      count: stats?.todayLeadCount || 0,
      label: 'waiting'
    },
    {
      title: "Today's Follow-ups",
      icon: 'bi-clock-history',
      color: 'warning',
      href: '/telecallingcrm.linkarise.in/leads/followup',
      count: getPendingFollowups(),
      label: 'pending'
    },
    {
      title: 'Allocate Leads',
      icon: 'bi-arrow-left-right',
      color: 'info',
      href: '/telecallingcrm.linkarise.in/leads/allocate',
      count: null,
      label: 'Distribute to team'
    }
  ]

  return (
    <div className='card card-flush h-md-100'>
      <div className='card-header pt-7'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bold text-gray-800'>Quick Actions</span>
          <span className='text-gray-500 mt-1 fw-semibold fs-6'>Frequently used features</span>
        </h3>
      </div>
      <div className='card-body pt-5'>
        <div className='d-flex flex-column gap-4'>
          {actions.map((action, index) => (
            <a 
              key={index}
              href={action.href} 
              className={`btn btn-flex flex-column btn-light-${action.color} btn-active-color-${action.color} p-5 dashboard-action-btn`}
            >
              <i className={`${action.icon} fs-2x mb-2`}></i>
              <span className='fw-bold fs-6'>{action.title}</span>
              <small className='text-muted mt-1'>
                {loading ? 'Loading...' : action.count !== null ? `${action.count} ${action.label}` : action.label}
              </small>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}