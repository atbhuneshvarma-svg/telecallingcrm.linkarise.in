import React, { useState, useEffect } from 'react'
import { ToolbarWrapper } from '../../../_metronic/layout/components/toolbar'
import { Content } from '../../../_metronic/layout/components/content'
import { getDashboardStats, DashboardStats } from '../../modules/auth/core/_requests'
import { DashboardHeader } from './components/DashboardHeader'
import { StatsGrid } from './components/StatsGrid'
import { PerformanceTable } from './components/PerformanceTable'
import ConvertedClientsTable from './components/ConvertedClientsTable'
import { QuickActions } from './components/QuickActions'
import { TeamMembers } from './components/TeamMembers'
import { RecentActivities } from './components/RecentActivities'
import LeadCallsChart from './components/LeadCallsChart'

const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchDashboardData()

    // Auto-refresh every 5 minutes
    const interval = setInterval(fetchDashboardData, 300000)

    return () => clearInterval(interval)
  }, [])

  const fetchDashboardData = async () => {
    try {
      setError(null)
      setLoading(true)

      const response = await getDashboardStats()
      setStats(response.data)
      setLastUpdated(new Date())
    } catch (error: any) {
      console.error('Failed to fetch dashboard data:', error)
      const errorMessage = error.response?.data?.message || 'Unable to load dashboard data. Please try again.'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = () => {
    fetchDashboardData()
  }

  return (
    <>
      <ToolbarWrapper />
      <Content>
        <DashboardHeader
          error={error}
          loading={loading}
          onRefresh={handleRefresh}
          onClearError={() => setError(null)}
        />

        {/* Stats Grid - Top 4 Cards */}
        <StatsGrid stats={stats} loading={loading} />


        {/* Main Content Area - Tables Side by Side */}
        <div className='row g-5 gx-xl-10 mb-5 mb-xl-10'>
          {/* Today's Performance Table - Left Side */}
          <div className='col-xl-6'>
            <div className='card h-100'>
              <div className='card-header border-0 pt-7'>
                <h3 className='card-title align-items-start flex-column'>
                  <span className='card-label fw-bold fs-3 text-dark'>TODAY PERFORMANCE</span>
                </h3>
              </div>
              <div className='card-body py-3'>
                <PerformanceTable stats={stats} loading={loading} />
              </div>
            </div>
          </div>

          {/* Recent Converted Clients Table - Right Side */}
          <div className='col-xl-6'>
            <div className='card h-100'>
              <div className='card-header border-0 pt-7'>
                <h3 className='card-title align-items-start flex-column'>
                  <span className='card-label fw-bold fs-3 text-dark'>RECENT CONVERTED CLIENT</span>
                </h3>
              </div>
              <div className='card-body py-3'>
                <ConvertedClientsTable stats={stats} loading={loading} />
              </div>
            </div>
          </div>
        </div>

        {/* Additional Components Row */}
        <div className='row g-5 gx-xl-10'>
          {/* Quick Actions */}
          <div className='col-xl-4 mb-5 mb-xl-10'>
            <QuickActions stats={stats} loading={loading} />
          </div>

          {/* Team Members */}
          <div className='col-xl-4 mb-5 mb-xl-10'>
            <TeamMembers stats={stats} loading={loading} />
          </div>

          {/* Recent Activities */}
          <div className='col-xl-4 mb-5 mb-xl-10'>
            <RecentActivities loading={loading} />
          </div>
        </div>

        {/* Monthly Lead Performance Chart */}
        <div className='card mb-10'>
          <div className='card-header border-0 pt-7 d-flex flex-column'>
            <h3 className='card-title align-items-start flex-column'>
              <span className='card-label fw-bold fs-3 text-dark'>
                Monthly Lead Performance
              </span>

              <span className='text-muted mt-1 fw-semibold fs-6'>
                Total Leads This Year: {stats?.totalLeads?.reduce((a, b) => a + b, 0) ?? 0}
              </span>
            </h3>
          </div>

          <div className='card-body'>
            <div className='row'>
              <div className='col-12'>
                <div style={{ height: '350px' }}>
                  <LeadCallsChart
                    data={{
                      months: stats?.months ?? [],
                      totalCallsData: stats?.totalCallsData ?? [],
                      confirmedCallsData: stats?.confirmedCallsData ?? [],
                      totalLeads: stats?.totalLeads ?? [],
                      convertedClients: stats?.convertedClients ?? [],
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>



        {/* Bottom Row - Full Width Components */}
        <div className='row g-5 gx-xl-10'>
          {/* Additional full-width components can go here */}
          <div className='col-12'>
            {/* You can add charts, additional tables, or other full-width components here */}
          </div>
        </div>

      </Content>
    </>
  )
}

export { DashboardPage }