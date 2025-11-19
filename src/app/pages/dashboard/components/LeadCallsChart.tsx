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

// <<< ADD TYPES HERE
// In LeadCallsChart component file
export interface LeadCallsChartProps {
  data: {
    months: string[]
    totalCallsData: number[]
    confirmedCallsData: number[]
    totalLeads: number[]
    convertedClients: number[]
  }
  loading?: boolean // Add this as optional
}
// >>>

export default function LeadCallsChart({ data }: LeadCallsChartProps) {
  const chartData = {
    labels: data.months,
    datasets: [
      {
        label: 'Total Calls',
        data: data.totalCallsData,
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.35)',
        fill: true,
        tension: 0.3,
      },
      {
        label: 'Confirmed Calls',
        data: data.confirmedCallsData,
        borderColor: '#22c55e',
        backgroundColor: 'rgba(34, 197, 94, 0.35)',
        fill: true,
        tension: 0.3,
      },
      {
        label: 'Total Leads',
        data: data.totalLeads,
        borderColor: '#a855f7',
        backgroundColor: 'rgba(168, 85, 247, 0.35)',
        fill: true,
        tension: 0.3,
      },
      {
        label: 'Converted Clients',
        data: data.convertedClients,
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

  return (
    <div style={{ height: '350px' }}>
      <Line data={chartData} options={options} />
    </div>
  )
}
