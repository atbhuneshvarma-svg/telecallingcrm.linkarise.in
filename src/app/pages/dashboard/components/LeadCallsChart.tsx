import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend)

/* ------------------------------------------
   TYPES (Correct & Strict)
-------------------------------------------*/
export interface LeadCallsChartProps {
  data: {
    months: string[]
    totalCallsData: number[]
    confirmedCallsData: number[]
    totalLeads: number[]
    convertedClients: number[]
  }
  loading?: boolean
}

/* ------------------------------------------
   COMPONENT
-------------------------------------------*/
export default function LeadCallsChart({ data, loading }: LeadCallsChartProps) {
  // Safe fallback values to prevent crashes while loading
  const months = data?.months ?? []
  const totalCalls = data?.totalCallsData ?? []
  const confirmedCalls = data?.confirmedCallsData ?? []
  const totalLeads = data?.totalLeads ?? []
  const converted = data?.convertedClients ?? []

  const chartData = {
    labels: months,
    datasets: [
      {
        label: 'Total Calls',
        data: totalCalls,
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.35)',
        fill: true,
        tension: 0.3,
      },
      {
        label: 'Confirmed Calls',
        data: confirmedCalls,
        borderColor: '#22c55e',
        backgroundColor: 'rgba(34, 197, 94, 0.35)',
        fill: true,
        tension: 0.3,
      },
      {
        label: 'Total Leads',
        data: totalLeads,
        borderColor: '#a855f7',
        backgroundColor: 'rgba(168, 85, 247, 0.35)',
        fill: true,
        tension: 0.3,
      },
      {
        label: 'Converted Clients',
        data: converted,
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.35)',
        fill: true,
        tension: 0.3,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: 350 }}>
        <div className="spinner-border text-primary"></div>
      </div>
    )
  }

  return (
    <div style={{ height: '350px' }}>
      <Line data={chartData} options={options} />
    </div>
  )
}
