import React, { useState } from 'react'
import { FreshLeadFilters } from '../components/FreshLeadFilters'
import { FreshLeadsTable } from '../components/FreshLeadsTable'
import { Pagination } from '../components/Pagination'
import { FreshLeadFilters as FreshLeadFiltersType } from '../core/_models'
import { useFreshLeads } from '../hooks/useFreshLeads'

export const FreshLeadsPage: React.FC = () => {
  const [filters, setFilters] = useState<FreshLeadFiltersType>({
    search: '',
    campaignmid: undefined,
    statusname: undefined,
    usermid: undefined,
    page: 1,
    per_page: 10,
  })

  const { leads, pagination, isLoading, refetch } = useFreshLeads(filters)

  const handleFiltersChange = (updated: FreshLeadFiltersType) => {
    setFilters((prev) => ({ ...prev, ...updated, page: 1 }))
  }

  const handleReset = () => {
    setFilters({
      search: '',
      campaignmid: undefined,
      statusname: undefined,
      usermid: undefined,
      page: 1,
      per_page: 10,
    })
  }

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }))
  }

  const handlePerPageChange = (perPage: number) => {
    setFilters((prev) => ({ ...prev, per_page: perPage, page: 1 }))
  }

  return (
    <div>
      <FreshLeadFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onReset={handleReset}
        onRefresh={refetch}
        totalLeads={pagination?.total_rows ?? 0}
        isLoading={isLoading}
        leads={leads} // pass fresh leads so dropdown can use them
      />

      <FreshLeadsTable
        leads={leads}
        isLoading={isLoading}
        currentPage={filters.page ?? 1}
        perPage={filters.per_page ?? 10}
      />

      <Pagination
        currentPage={pagination?.current_page ?? 1}
        totalPages={pagination?.total_pages ?? 1}
        totalRecords={pagination?.total_rows ?? 0}
        perPage={pagination?.per_page ?? filters.per_page}
        onPageChange={handlePageChange}
        onPerPageChange={handlePerPageChange}
      />
    </div>
  )
}
