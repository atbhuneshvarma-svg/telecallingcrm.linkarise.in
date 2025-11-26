import React, { useState, useEffect } from 'react'
import { ToolbarWrapper } from '../../../_metronic/layout/components/toolbar'
import { Content } from '../../../_metronic/layout/components/content'
import { DashboardStats } from '../../modules/auth/core/_models'
import { getDashboardStats } from '../../modules/auth/core/_requests'
import { DashboardHeader } from './components/DashboardHeader'
import { StatsGrid } from './components/StatsGrid'
import { PerformanceTable } from './components/PerformanceTable'
import { QuickActions } from './components/QuickActions'
import { TeamMembers } from './components/TeamMembers'
import { RecentActivities } from './components/RecentActivities'
import LeadCallsChart from './components/LeadCallsChart'
import ConvertedClientsTable from './components/ConvertedClientsTable'

const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchDashboardData()
    const interval = setInterval(fetchDashboardData, 300000) // every 5 min
    return () => clearInterval(interval)
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await getDashboardStats()
      setStats(response.data)
      setLastUpdated(new Date())
    } catch (err: any) {
      console.error('Dashboard Fetch Error:', err)
      setError(err.response?.data?.message || 'Unable to load dashboard data.')
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = () => fetchDashboardData()

  return (
    <>
      <ToolbarWrapper />
      <Content>

        {/* Header */}
        <DashboardHeader
          error={error}
          loading={loading}
          onRefresh={handleRefresh}
          onClearError={() => setError(null)}
          lastUpdated={lastUpdated}
          stats={stats}
        />

        {/* Stats Cards */}
        <StatsGrid stats={stats} loading={loading} />

        {/* Performance + Recent Converted */}
        <div className='row g-5 gx-xl-10 mb-5 mb-xl-10'>

          {/* Left: Performance Table */}
          <div className='col-xl-6'>
            <div className='card h-100'>
              <div className='card-header border-0 pt-7'>
                <h3 className='card-title fw-bold fs-3'>TODAY PERFORMANCE</h3>
              </div>
              <div 
                className='card-body py-3'
                style={{ height: '350px', overflowY: 'auto' }} // added scroll
              >
                <PerformanceTable stats={stats} loading={loading} />
              </div>
            </div>
          </div>

          {/* Right: Recent Converted Clients */}
          <div className='col-xl-6'>
            <div className='card h-100'>
              <div className='card-header border-0 pt-7'>
                <h3 className='card-title fw-bold fs-3'>RECENT CONVERTED</h3>
              </div>
              <div 
                className='card-body py-3'
                style={{ height: '350px', overflowY: 'auto' }} // added scroll
              >
                <ConvertedClientsTable stats={stats} loading={loading} />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions, Team Members, Activities */}
        <div className='row g-5 gx-xl-10'>
          <div className='col-xl-6'>
            <QuickActions stats={stats} loading={loading} />
          </div>
          <div className='col-xl-6'>
            <TeamMembers stats={stats} loading={loading} />
          </div>
          {/* <div className='col-xl-4'>
            <RecentActivities loading={loading} />
          </div> */}
        </div>

        {/* Monthly Lead Performance Chart */}
        <div className='card mb-10'>
          <div className='card-header border-0 pt-7'>
            <h3 className='card-title fw-bold fs-3 mb-0'>
              Monthly Lead Performance
            </h3>
            <span className='text-muted mt-1 fw-semibold fs-6'>
              Total Leads This Year: {stats?.totalLeads ?? 0}
            </span>
          </div>
          <div className='card-body'>
            <div style={{ height: '350px' }}>
              <LeadCallsChart
                data={{
                  months: stats?.weekly?.weekNames ?? [],
                  totalCallsData: stats?.weekly?.total ?? [],
                  confirmedCallsData: stats?.weekly?.converted ?? [],
                  totalLeads: stats?.weekly?.total ?? [],
                  convertedClients: stats?.weekly?.converted ?? [],
                }}
              />
            </div>
          </div>
        </div>

      </Content>
    </>
  )
}

export { DashboardPage }
