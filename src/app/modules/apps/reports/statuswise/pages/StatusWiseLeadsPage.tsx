// src/app/modules/apps/leads/statuswise/pages/StatusWiseLeadsPage.tsx
import React, { useState, useEffect } from 'react'
import { useStatusWiseLeads } from '../hooks/useStatusWiseLeads'
import StatusFilters from '../components/StatusFilters'
import StatusLeadsTable from '../components/StatusLeadsTable'
import ExportButtons from '../components/ExportButtons'
import TableSummary from '../components/TableSummary'
import { Filters, FilterOptions } from '../core/_models'

const StatusWiseLeadsPage = () => {
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

  const handleFilterChange = (newFilters: Filters) => {
    setFilters(newFilters)
  }

  const handleDateChange = (dates: [Date, Date]) => {
    // Handle date change if needed
  }

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }))
  }

  const handleRowsPerPageChange = (perPage: number) => {
    setFilters(prev => ({ ...prev, per_page: perPage, page: 1 }))
  }

  const handleResetFilters = () => {
    setFilters({
      leadmids: [14401, 14406],
      page: 1,
      per_page: 10,
      date_from: '2025-12-01',
      date_to: '2025-12-01',
      campaign: '',
      telecaller: '',
      statusname: '',
    })
  }

  const handleExportExcel = () => {
    // Export to Excel logic
    console.log('Export to Excel')
  }

  const handleExportPDF = () => {
    // Export to PDF logic
    console.log('Export to PDF')
  }

  return (
    <div className="container-fluid" style={{ padding: '20px', background: '#f8f9fa', minHeight: '100vh' }}>
      <div className="card" style={{ border: '1px solid #dee2e6', borderRadius: '4px' }}>
        <div className="card-header" style={{
          background: '#fff',
          borderBottom: '1px solid #dee2e6',
          padding: '15px 20px'
        }}>
          <h3 className="card-title mb-0" style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#333'
          }}>
            Status Wise Lead
          </h3>
        </div>

        <div className="card-body" style={{ padding: '20px' }}>
          {/* Filters */}
          <StatusFilters
            filters={filters}
            filterOptions={filterOptions}
            dateRange={[new Date(filters.date_from), new Date(filters.date_to)]}
            onFilterChange={handleFilterChange}
            onDateChange={handleDateChange}
            onApplyFilters={refetch}
            onResetFilters={handleResetFilters}
          />

          {/* Data Table */}
          <StatusLeadsTable
            leads={leads}
            isLoading={isLoading}
            pagination={pagination}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
          />

          {/* Table Summary */}
          <TableSummary
            from={pagination.from}
            to={pagination.to}
            total={pagination.total}
            currentPage={pagination.current_page}
            totalPages={Math.ceil(pagination.total / pagination.per_page)}
          />

          {/* Export Buttons */}
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
              statusname: filters.statusname
            }}
          />
        </div>

        {/* Footer */}
        <div className="card-footer" style={{
          background: '#fff',
          borderTop: '1px solid #dee2e6',
          padding: '15px 20px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '14px', color: '#666' }}>
            © 2025® Arth Technology
          </div>
        </div>
      </div>
    </div>
  )
}

export default StatusWiseLeadsPage