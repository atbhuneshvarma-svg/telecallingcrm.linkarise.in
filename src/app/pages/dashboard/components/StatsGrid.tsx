import React from 'react'
import { DashboardStats } from '../../../modules/auth/core/_requests'
import { StatCard } from './StatCard'

interface StatsGridProps {
  stats: DashboardStats | null
  loading: boolean
}

export const StatsGrid: React.FC<StatsGridProps> = ({ stats, loading }) => {
  // Calculate today's calls from leadscalltodaypf
  const getTodaysCalls = () => {
    if (!stats?.leadscalltodaypf) return 0 // Fallback to 3 if no data
    let totalCalls = 0
    Object.values(stats.leadscalltodaypf).forEach(userCalls => {
      totalCalls += userCalls.length
    })
    return totalCalls
  }

  // Use the actual data from your API response
  const freshLeads = stats?.leadCount ?? 0
  const todaysFollowup = stats?.todayLeadCount ?? 0
  const todaysCalls = getTodaysCalls()
  const convertedToClient = stats?.thismonthclientCount ?? 0
  return (
    <div className='row g-5 g-xl-10 mb-5 mb-xl-10'>
      {/* Fresh Leads - 5981 */}
      <div className='col-md-6 col-lg-3 col-xl-3 col-xxl-3 mb-md-5 mb-xl-10'>
        <StatCard
          title='Fresh Leads'
          value={freshLeads}
          color='primary'
          icon='bi-lightning-charge'
          loading={loading}
        />
      </div>

      {/* Today's Followup - 3 */}
      <div className='col-md-6 col-lg-3 col-xl-3 col-xxl-3 mb-md-5 mb-xl-10'>
        <StatCard
          title="Today's Followup"
          value={todaysFollowup}
          color='warning'
          icon='bi-clock-history'
          loading={loading}
        />
      </div>

      {/* Today's Calls - Calculated from leadscalltodaypf */}
      <div className='col-md-6 col-lg-3 col-xl-3 col-xxl-3 mb-md-5 mb-xl-10'>
        <StatCard
          title="Today's Calls"
          value={todaysCalls}
          color='info'
          icon='bi-telephone'
          loading={loading}
        />
      </div>

      {/* Converted to Client - 4 */}
      <div className='col-md-6 col-lg-3 col-xl-3 col-xxl-3 mb-md-5 mb-xl-10'>
        <StatCard
          title='All Client'
          value={convertedToClient}
          color='success'
          icon='bi-check-circle'
          loading={loading}
        />
      </div>
    </div>
  )
}