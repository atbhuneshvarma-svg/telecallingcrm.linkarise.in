// components/LeadsTable.tsx
import React, { useState, useEffect } from 'react'
import DataTable, { TableColumn } from 'react-data-table-component'
import { format } from 'date-fns'
import { Lead, Pagination } from '../core/types'
import { useThemeMode } from '../../../../../../_metronic/partials/layout/theme-mode/ThemeModeProvider'

interface LeadsTableProps {
  leads: Lead[]
  loading: boolean
  pagination: Pagination
  onPageChange: (page: number) => void
}

const LeadsTable: React.FC<LeadsTableProps> = ({
  leads,
  loading,
  pagination,
  onPageChange
}) => {
  const { mode } = useThemeMode()
  const isDark = mode === 'dark'

  const [showSkeleton, setShowSkeleton] = useState(false)

  useEffect(() => {
    if (loading) {
      setShowSkeleton(true)
    } else {
      const timeout = setTimeout(() => setShowSkeleton(false), 2000) // 2s delay
      return () => clearTimeout(timeout)
    }
  }, [loading])

  // Skeleton rows
  const skeletonRows: Lead[] = Array.from({ length: pagination.per_page || 10 }).map((_, index) => ({
    leadmid: index,
    campaign: '',
    telecaller: '',
    prospectname: '',
    mobile: '',
    stage: '',
    stagedate: '',
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
      <span
        className="placeholder col-12"
        style={{ height: '20px', display: 'block', borderRadius: '4px' }}
      ></span>
    </div>
  )

  const columns: TableColumn<Lead>[] = [
    {
      name: 'Sr.No',
      cell: (_, index) =>
        showSkeleton ? <SkeletonCell /> : index + 1 + (pagination.page - 1) * pagination.per_page,
      width: '80px',
      center: true
    },
    { name: 'Campaign', cell: row => (showSkeleton ? <SkeletonCell /> : row.campaign), sortable: true },
    { name: 'User', cell: row => (showSkeleton ? <SkeletonCell /> : row.telecaller), sortable: true },
    { name: 'Lead Name', cell: row => (showSkeleton ? <SkeletonCell /> : row.prospectname), sortable: true },
    { name: 'Mobile', cell: row => (showSkeleton ? <SkeletonCell /> : row.mobile), center: true },
    { name: 'Stage', cell: row => (showSkeleton ? <SkeletonCell /> : row.stage), sortable: true },
    { name: 'Stage Date', cell: row => (showSkeleton ? <SkeletonCell /> : formatDate(row.stagedate)), sortable: true, center: true },
    { name: 'Added On', cell: row => (showSkeleton ? <SkeletonCell /> : formatDate(row.created_at)), sortable: true, center: true }
  ]

  // Copy headCells and cells styles from StatusLeadsTable
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
    />
  )
}

export default LeadsTable
