// src/app/modules/apps/leads/statuswise/pages/StatusWiseLeadsPage.tsx
import React, { useState, useEffect } from 'react'
import { useThemeMode } from '../../../../../../_metronic/partials/layout/theme-mode/ThemeModeProvider'
import { useStatusWiseLeads } from '../hooks/useStatusWiseLeads'
import StatusFilters from '../components/StatusFilters'
import StatusLeadsTable from '../components/StatusLeadsTable'
import ExportButtons from '../components/ExportButtons'
import TableSummary from '../components/TableSummary'
import { Filters, FilterOptions } from '../core/_models'

const StatusWiseLeadsPage = () => {
  const { mode } = useThemeMode() // Get current theme mode
  const [filters, setFilters] = useState<Filters>({
    leadmids: [14401, 14406],
    page: 1,
    per_page: 10,
    date_from: '2025-12-01',
    date_to: '2025-12-01',
    campaign: '',
    telecaller: '',
    statusname: '',
  })

  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    campaigns: [],
    telecallers: [],
    statuses: []
  })

  const { leads, isLoading, pagination, refetch } = useStatusWiseLeads(filters)

  // Extract unique filter options from leads data
  useEffect(() => {
    if (leads.length > 0) {
      const campaigns = Array.from(new Set(leads.map(lead => lead.campaign))).filter(Boolean)
      const telecallers = Array.from(new Set(leads.map(lead => lead.telecaller))).filter(Boolean)
      const statuses = Array.from(new Set(leads.map(lead => lead.statusname))).filter(Boolean)

      setFilterOptions({
        campaigns: campaigns.map(c => ({ value: c, label: c })),
        telecallers: telecallers.map(t => ({ value: t, label: t })),
        statuses: statuses.map(s => ({ value: s, label: s }))
      })
    }
  }, [leads])

  const handleFilterChange = (newFilters: Filters) => setFilters(newFilters)
  const handleDateChange = (dates: [Date, Date]) => { }
  const handlePageChange = (page: number) => setFilters(prev => ({ ...prev, page }))
  const handleRowsPerPageChange = (perPage: number) => setFilters(prev => ({ ...prev, per_page: perPage, page: 1 }))
  const handleResetFilters = () => setFilters({
    leadmids: [14401, 14406],
    page: 1,
    per_page: 10,
    date_from: '2025-12-01',
    date_to: '2025-12-01',
    campaign: '',
    telecaller: '',
    statusname: '',
  })

  const handleExportExcel = () => console.log('Export to Excel')
  const handleExportPDF = () => console.log('Export to PDF')

  // Dynamic background and text color based on theme
  const containerStyle = {
    padding: '20px',
    minHeight: '100vh',
    background: mode === 'dark' ? '#141414' : '#f8f9fa',
    color: mode === 'dark' ? '#fff' : '#000',
  }

  const cardStyle = {
    borderRadius: '4px',
    background: mode === 'dark' ? '#1f1f1f' : '#fff',
  }

  const cardHeaderStyle = {
    background: mode === 'dark' ? '#1a1a1a' : '#fff',
    borderBottom: '1px solid #dee2e6',
    padding: '15px 20px',
  }

  const cardFooterStyle: React.CSSProperties = {
    background: mode === 'dark' ? '#1a1a1a' : '#fff',
    borderTop: '1px solid #dee2e6',
    padding: '15px 20px',
    textAlign: 'center', // now TypeScript is happy
    color: mode === 'dark' ? '#ccc' : '#666',
  }


 return (
  <div className="container-fluid " style={containerStyle}>
    <div className="card" style={cardStyle}>
      <div className="card-header" style={cardHeaderStyle}>
        <h1 className="fw-bold text-gray-800 mt-5">
          Status Wise Lead
        </h1>
      </div>

      <div className="card-body" style={{ padding: 20 }}>
        <StatusFilters
          filters={filters}
          filterOptions={filterOptions}
          dateRange={[new Date(filters.date_from), new Date(filters.date_to)]}
          onFilterChange={handleFilterChange}
          onDateChange={handleDateChange}
          onApplyFilters={refetch}
          onResetFilters={handleResetFilters}
        />

        <StatusLeadsTable
          leads={leads}
          isLoading={isLoading}
          pagination={pagination}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
        />

        <TableSummary
          from={pagination.from}
          to={pagination.to}
          total={pagination.total}
          currentPage={pagination.current_page}
          totalPages={Math.ceil(pagination.total / pagination.per_page)}
        />

        <ExportButtons
          onExportExcel={handleExportExcel}
          onExportPDF={handleExportPDF}
          dataCount={leads.length}
          leads={leads}
          filters={{
            date_from: filters.date_from,
            date_to: filters.date_to,
            campaign: filters.campaign,
            telecaller: filters.telecaller,
            statusname: filters.statusname,
          }}
        />
      </div>
    </div>
  </div>
)

}

export default StatusWiseLeadsPage
