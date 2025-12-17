import React, { useState, useCallback, useMemo } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { useTelecallerPerformance } from '../hooks/useTelecallerPerformance'
import { TelecallerPerformanceFilters as TelecallerPerformanceFiltersType } from '../core/_models'
import { TelecallerPerformanceFilters } from '../components/TelecallerPerformanceFilters'
import { TelecallerPerformanceTable } from '../components/TelecallerPerformanceTable'
import { Pagination } from '../components/Pagination'

export const TelecallerPerformancePage: React.FC = () => {
  const [filters, setFilters] = useState<TelecallerPerformanceFiltersType>({
    page: 1,
    per_page: 10,
    search: '',
    date_from: undefined,
    date_to: undefined,
    telecaller_id: undefined,
  })

  const [searchTerm, setSearchTerm] = useState('')

  const {
    performanceData,
    telecallers,
    pagination,
    performanceMetrics,
    isLoading,
    error,
    refetch,
  } = useTelecallerPerformance(filters)

  const showingStats = useMemo(() => ({
    from: pagination.from || 1,
    to: pagination.to || 0,
    total: pagination.total_rows
  }), [pagination.from, pagination.to, pagination.total_rows])

  const handleFiltersChange = useCallback((newFilters: Partial<TelecallerPerformanceFiltersType>) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }))
  }, [])

  const handleResetFilters = useCallback(() => {
    setFilters({
      page: 1,
      per_page: 10,
      search: '',
      date_from: undefined,
      date_to: undefined,
      telecaller_id: undefined,
    })
  }, [])

  const handlePageChange = useCallback((page: number) => {
    setFilters(prev => ({ ...prev, page }))
  }, [])

  const handlePerPageChange = useCallback((perPage: number) => {
    setFilters(prev => ({ ...prev, per_page: perPage, page: 1 }))
  }, [])

  const handleRefresh = useCallback(() => {
    refetch()
  }, [refetch])

  // Auto-refresh every 30 seconds
  React.useEffect(() => {
    if (!isLoading) {
      const interval = setInterval(() => {
        refetch()
      }, 30000)

      return () => clearInterval(interval)
    }
  }, [isLoading, refetch])

  return (
    <Container fluid>
      <Row>
        <Col>
          {/* Filters Section */}
          <TelecallerPerformanceFilters
            filters={filters}
            telecallers={telecallers}
            onFiltersChange={handleFiltersChange}
            onReset={handleResetFilters}
            onRefresh={handleRefresh}
            totalTelecallers={pagination.total_rows}
            isLoading={isLoading}
          />

          {/* Performance Table */}
          <TelecallerPerformanceTable
            performanceData={performanceData}
            isLoading={isLoading}
            currentPage={pagination.current_page}
            perPage={pagination.per_page}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />

          {/* Pagination */}
          {performanceData.length > 0 && (
            <Pagination
              currentPage={pagination.current_page}
              totalPages={pagination.total_pages}
              totalRecords={pagination.total_rows}
              perPage={pagination.per_page}
              onPageChange={handlePageChange}
              onPerPageChange={handlePerPageChange}
            />
          )}
        </Col>
      </Row>
    </Container>
  )
}