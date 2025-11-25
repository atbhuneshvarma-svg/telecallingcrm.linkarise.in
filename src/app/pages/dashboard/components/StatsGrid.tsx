import React from 'react'
import { DashboardStats } from '../../../modules/auth/core/_models'
import { StatCard } from './StatCard'

interface StatsGridProps {
  stats: DashboardStats | null
  loading: boolean
}

export const StatsGrid: React.FC<StatsGridProps> = ({ stats, loading }) => {
  // === ALL STATS IN SINGLE GROUP ===
  const allStats = [
    { label: 'Fresh Leads', value: stats?.freshLeadsToday ?? 0, icon: 'bi-lightning-charge', color: 'success' },
    { label: 'Interested', value: stats?.interested ?? 0, icon: 'bi-hand-thumbs-up', color: 'info' },
    { label: 'Converted', value: stats?.converted ?? 0, icon: 'bi-star-fill', color: 'warning' },
    { label: 'Not Interested', value: stats?.notInterested ?? 0, icon: 'bi-x-circle', color: 'danger' },

    {
      label: 'Total Leads',
      value: stats?.totalLeads ?? 0,
      icon: 'bi-bar-chart',
      color: 'primary',
      onClick: () => {
        window.location.href = '/telecallingcrm.linkarise.in/leads/allleads'
      },
    },

    { label: 'Follow-ups', value: stats?.todayFollowup ?? 0, icon: 'bi-arrow-repeat', color: 'dark' },
    { label: 'Calls', value: stats?.todayCalls ?? 0, icon: 'bi-telephone', color: 'info' },  
    { label: 'Answered', value: stats?.todayAnswered ?? 0, icon: 'bi-check-circle', color: 'success' },
  ]


  // Split into chunks of 4
  const chunkedStats: typeof allStats[] = []
  for (let i = 0; i < allStats.length; i += 4) {
    chunkedStats.push(allStats.slice(i, i + 4))
  }

  return (
    <div className='mb-5'>

      {chunkedStats.map((chunk, idx) => (
        <div className='row g-5 mb-5 p-3' key={idx}>
          {chunk.map((item, index) => (
            <div key={index} className='col-md-6 col-lg-3'>
              <StatCard
                title={item.label}
                value={item.value}
                icon={item.icon}
                color={item.color}
                loading={loading}
                onClick={item.onClick}   // <-- here
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
