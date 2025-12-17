// src/app/modules/apps/leads/statuswise/components/StatusLeadsTable.tsx
import React, { useState, useEffect } from 'react'
import DataTable, { TableColumn } from 'react-data-table-component'
import { LeadStatusData } from '../core/_models'
import { format } from 'date-fns'
import { useThemeMode } from '../../../../../../_metronic/partials/layout/theme-mode/ThemeModeProvider'

interface StatusLeadsTableProps {
  leads: LeadStatusData[]
  isLoading: boolean
  pagination: {
    current_page: number
    per_page: number
    total: number
    from: number
    to: number
  }
  onPageChange: (page: number) => void
  onRowsPerPageChange: (perPage: number) => void
}

const StatusLeadsTable: React.FC<StatusLeadsTableProps> = ({
  leads,
  isLoading,
  pagination,
  onPageChange,
  onRowsPerPageChange
}) => {
  const { mode } = useThemeMode()
  const isDark = mode === 'dark'

  // Delayed skeleton state
  const [showSkeleton, setShowSkeleton] = useState(false)

  useEffect(() => {
    if (isLoading) {
      setShowSkeleton(true)
    } else {
      const timeout = setTimeout(() => setShowSkeleton(false), 2000)
      return () => clearTimeout(timeout)
    }
  }, [isLoading])

  // Skeleton rows
  const skeletonRows: LeadStatusData[] = Array.from({ length: pagination.per_page || 10 }).map((_, index) => ({
    leadmid: index,
    prospectname: '',
    mobile: '',
    campaign: '',
    telecaller: '',
    statusname: '',
    statusdate: '',
    created_at: ''
  }))

  const formatDate = (date?: string) => {
    if (!date) return ''
    const d = new Date(date)
    return isNaN(d.getTime()) ? '' : format(d, 'dd-MM-yyyy')
  }

  // Skeleton placeholder
  const SkeletonCell = () => (
    <div className="placeholder-wave w-100">
      <span className="placeholder col-12" style={{ height: '20px', display: 'block', borderRadius: '4px' }}></span>
    </div>
  )

  const columns: TableColumn<LeadStatusData>[] = [
    {
      name: 'Sr.No',
      cell: (_, index) => showSkeleton ? <SkeletonCell /> : index + 1 + (pagination.current_page - 1) * pagination.per_page,
      width: '80px',
      center: true
    },
    { name: 'Campaign', cell: row => showSkeleton ? <SkeletonCell /> : row.campaign, sortable: true },
    { name: 'User', cell: row => showSkeleton ? <SkeletonCell /> : row.telecaller, sortable: true },
    { name: 'Lead Name', cell: row => showSkeleton ? <SkeletonCell /> : row.prospectname, sortable: true },
    { name: 'Mobile', cell: row => showSkeleton ? <SkeletonCell /> : row.mobile, center: true },
    { name: 'Status', cell: row => showSkeleton ? <SkeletonCell /> : row.statusname, sortable: true },
    { name: 'Status Date', cell: row => showSkeleton ? <SkeletonCell /> : formatDate(row.statusdate), sortable: true, center: true },
    { name: 'Added On', cell: row => showSkeleton ? <SkeletonCell /> : formatDate(row.created_at), sortable: true, center: true }
  ]

  const customStyles = {
    headCells: {
      style: {
        backgroundColor: isDark ? '#1a1a1a' : '#f8f9fa',
        color: isDark ? '#ccc' : '#333',
        fontWeight: 600,
        fontSize: '14px',
        borderBottom: isDark ? '2px solid #333' : '2px solid #dee2e6',
        padding: '12px 15px'
      }
    },
    cells: {
      style: {
        fontSize: '14px',
        color: isDark ? '#ccc' : '#333',
        backgroundColor: isDark ? '#1a1a1a' : '#f8f9fa',
        padding: '12px 15px',
        borderBottom: isDark ? '1px solid #333' : '1px solid #dee2e6'
      }
    }
  }
  
  return (
    <DataTable
      columns={columns}
      data={showSkeleton ? skeletonRows : leads}
      customStyles={customStyles}
      striped
      highlightOnHover
      noDataComponent={
        <div className="text-center py-5">
          <i className="bi bi-inbox display-4 text-muted mb-3"></i>
          <p className="text-muted">No data available in table</p>
        </div>
      }
    />
  )
}

export default StatusLeadsTable
