// src/app/modules/apps/master/source-of-inquiry/SourceOfInquiryList.tsx
import React, { useState, useEffect } from 'react'
import DataTable, { TableColumn } from 'react-data-table-component'
import { SourceOfInquiry } from './core/_request'
import { useThemeMode } from '../../../../../_metronic/partials/layout/theme-mode/ThemeModeProvider'

interface SourceOfInquiryListProps {
  sourceOfInquiries: SourceOfInquiry[]
  loading?: boolean
  currentPage?: number
  perPage?: number
  onEditSourceOfInquiry: (sourceOfInquiry: SourceOfInquiry) => void
  onDeleteSourceOfInquiry: (id: number) => void
}

const SourceOfInquiryList: React.FC<SourceOfInquiryListProps> = ({
  sourceOfInquiries,
  loading = false,
  currentPage = 1,
  perPage = 10,
  onEditSourceOfInquiry,
  onDeleteSourceOfInquiry,
}) => {
  const { mode } = useThemeMode()
  const isDark = mode === 'dark'

  const [showSkeleton, setShowSkeleton] = useState(false)

  useEffect(() => {
    if (loading) {
      setShowSkeleton(true)
    } else {
      const timeout = setTimeout(() => setShowSkeleton(false), 500)
      return () => clearTimeout(timeout)
    }
  }, [loading])

  // Skeleton placeholder data
  const skeletonRows: SourceOfInquiry[] = Array.from({ length: 5 }).map((_, index) => ({
    id: index,
    name: '',
  }))

  const SkeletonCell = () => (
    <div className="placeholder-wave w-100">
      <span
        className="placeholder col-12"
        style={{ height: '20px', display: 'block', borderRadius: '4px' }}
      />
    </div>
  )

  const columns: TableColumn<SourceOfInquiry>[] = [
    {
      name: 'Sr.No',
      selector: (_, rowIndex) => (rowIndex ?? 0) + 1,
      cell: (_, rowIndex) => (showSkeleton ? <SkeletonCell /> : (rowIndex ?? 0) + 1),
      width: '60px',
      center: true,
      sortable: true,
    },
    {
      name: 'Source of Inquiry Name',
      selector: row => row.name,
      cell: row => showSkeleton ? <SkeletonCell /> : <span className="fw-bold">{row.name}</span>,
      sortable: true,
    },
    {
      name: 'Actions',
      cell: row =>
        showSkeleton ? (
          <SkeletonCell />
        ) : (
          <div className="dropdown">
            <button
              className="btn btn-sm btn-light btn-active-light-primary"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Actions <i className="bi bi-chevron-down ms-2"></i>
            </button>
            <ul className="dropdown-menu">
              <li>
                <button
                  className="dropdown-item"
                  onClick={() => onEditSourceOfInquiry(row)}
                >
                  <i className="bi bi-pencil me-2"></i>Edit
                </button>
              </li>
              <li>
                <button
                  className="dropdown-item text-danger"
                  onClick={() => onDeleteSourceOfInquiry(row.id)}
                >
                  <i className="bi bi-trash me-2"></i>Delete
                </button>
              </li>
            </ul>
          </div>
        ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: '150px',
      center: true,
    },
  ]

  const customStyles = {
    headCells: {
      style: {
        backgroundColor: isDark ? '#1a1a1a' : '#f8f9fa',
        color: isDark ? '#ccc' : '#333',
        fontWeight: 600,
        fontSize: '14px',
        borderBottom: isDark ? '2px solid #333' : '2px solid #dee2e6',
        padding: '12px 15px',
      },
    },
    cells: {
      style: {
        fontSize: '14px',
        color: isDark ? '#ccc' : '#333',
        backgroundColor: isDark ? '#1a1a1a' : '#fff',
        padding: '12px 15px',
        borderBottom: isDark ? '1px solid #333' : '1px solid #dee2e6',
      },
    },
  }

  return (
    <DataTable
      columns={columns}
      data={showSkeleton ? skeletonRows : sourceOfInquiries}
      customStyles={customStyles}
      striped
      highlightOnHover
      pointerOnHover
      responsive
      noHeader
      sortIcon={<i className="bi bi-arrow-down-up"></i>}
    />
  )
}

export default SourceOfInquiryList
