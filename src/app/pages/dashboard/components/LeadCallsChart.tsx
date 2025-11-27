import React from 'react'
import { Bar, Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js'
import { DashboardStats } from '../../../modules/auth/core/_models'

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

interface LeadCallsChartProps {
  stats?: DashboardStats | null
  loading?: boolean
  chartType?: 'weekly' | 'telecaller-performance'
  onChartTypeChange?: (type: 'weekly' | 'telecaller-performance') => void
}

const LeadCallsChart: React.FC<LeadCallsChartProps> = ({ 
  stats, 
  loading, 
  chartType = 'weekly',
  onChartTypeChange
}) => {
  // Weekly Performance Chart Data
  const weeklyChartData = {
    labels: stats?.weekly?.weekNames || ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'],
    datasets: [
      {
        label: 'Total Leads',
        data: stats?.weekly?.total || [],
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 2,
        borderRadius: 4,
      },
      {
        label: 'Total Converted',
        data: stats?.weekly?.converted || [],
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderColor: 'rgb(34, 197, 94)',
        borderWidth: 2,
        borderRadius: 4,
      }
    ],
  }

  // Telecaller Performance Graph Data
  const telecallerGraphData = {
    labels: stats?.barChart?.users || [],
    datasets: [
      {
        label: 'Total Calls',
        data: stats?.barChart?.total || [],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.3,
        fill: true,
      },
      {
        label: 'Answered Calls',
        data: stats?.barChart?.answered || [],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.3,
        fill: true,
      },
      {
        label: 'Converted',
        data: stats?.barChart?.converted || [],
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.3,
        fill: true,
      }
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: chartType === 'weekly' ? 'Weekly Performance' : 'Telecaller Performance',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
      x: {
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
    },
  }

  const graphOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Telecaller Performance Comparison',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
      x: {
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
    },
  }

  const handleChartTypeChange = (type: 'weekly' | 'telecaller-performance') => {
    if (onChartTypeChange) {
      onChartTypeChange(type)
    } else {
      // Fallback to window event for backward compatibility
      window.dispatchEvent(new CustomEvent('chartTypeChange', { detail: type }))
    }
  }

  if (loading) {
    return (
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">
            {chartType === 'weekly' ? 'Weekly Performance' : 'Telecaller Performance'}
          </h3>
        </div>
        <div className="card-body">
          <div className="d-flex justify-content-center align-items-center" style={{ height: '350px' }}>
            <div className="spinner-border text-primary"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">
          {chartType === 'weekly' ? 'Weekly Performance Chart' : 'Telecaller Performance Graph'}
        </h3>
        <div className="card-toolbar">
          <div className="btn-group">
            <button 
              className={`btn btn-sm ${chartType === 'weekly' ? 'btn-primary' : 'btn-light'}`}
              onClick={() => handleChartTypeChange('weekly')}
            >
              Weekly Chart
            </button>
            <button 
              className={`btn btn-sm ${chartType === 'telecaller-performance' ? 'btn-primary' : 'btn-light'}`}
              onClick={() => handleChartTypeChange('telecaller-performance')}
            >
              Performance Graph
            </button>
          </div>
        </div>
      </div>
      <div className="card-body">
        <div style={{ height: '350px' }}>
          {chartType === 'weekly' ? (
            <Bar data={weeklyChartData} options={chartOptions} />
          ) : (
            <Line data={telecallerGraphData} options={graphOptions} />
          )}
        </div>
        
        {/* Chart Statistics Summary */}
        <div className="row mt-4">
          {chartType === 'weekly' ? (
            <>
              <div className="col-6">
                <div className="d-flex align-items-center">
                  <div className="symbol symbol-30px me-3">
                    <div className="symbol-label bg-primary"></div>
                  </div>
                  <div>
                    <div className="fs-6 text-gray-600">Total Leads This Month</div>
                    <div className="fs-4 fw-bold text-gray-800">
                      {stats?.weekly?.total?.reduce((a, b) => a + b, 0) || 0}
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-6">
                <div className="d-flex align-items-center">
                  <div className="symbol symbol-30px me-3">
                    <div className="symbol-label bg-success"></div>
                  </div>
                  <div>
                    <div className="fs-6 text-gray-600">Converted This Month</div>
                    <div className="fs-4 fw-bold text-gray-800">
                      {stats?.weekly?.converted?.reduce((a, b) => a + b, 0) || 0}
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="col-4">
                <div className="d-flex align-items-center">
                  <div className="symbol symbol-30px me-3">
                    <div className="symbol-label bg-primary"></div>
                  </div>
                  <div>
                    <div className="fs-6 text-gray-600">Total Calls</div>
                    <div className="fs-4 fw-bold text-gray-800">
                      {stats?.barChart?.total?.reduce((a, b) => a + b, 0) || 0}
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-4">
                <div className="d-flex align-items-center">
                  <div className="symbol symbol-30px me-3">
                    <div className="symbol-label bg-success"></div>
                  </div>
                  <div>
                    <div className="fs-6 text-gray-600">Answered Calls</div>
                    <div className="fs-4 fw-bold text-gray-800">
                      {stats?.barChart?.answered?.reduce((a, b) => a + b, 0) || 0}
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-4">
                <div className="d-flex align-items-center">
                  <div className="symbol symbol-30px me-3">
                    <div className="symbol-label bg-danger"></div>
                  </div>
                  <div>
                    <div className="fs-6 text-gray-600">Total Converted</div>
                    <div className="fs-4 fw-bold text-gray-800">
                      {stats?.barChart?.converted?.reduce((a, b) => a + b, 0) || 0}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default LeadCallsChart