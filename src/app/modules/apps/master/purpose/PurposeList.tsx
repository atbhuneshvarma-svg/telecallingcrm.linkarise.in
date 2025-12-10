// src/app/modules/apps/master/purpose/PurposeList.tsx
import React, { useState, useEffect } from 'react'
import DataTable, { TableColumn } from 'react-data-table-component'
import { Purpose } from './core/_request'
import { useThemeMode } from '../../../../../_metronic/partials/layout/theme-mode/ThemeModeProvider'

interface PurposeListProps {
  purposes: Purpose[]
  loading?: boolean
  onEdit: (purpose: Purpose) => void
  onDelete: (id: number) => void
}

const PurposeList: React.FC<PurposeListProps> = ({
  purposes,
  loading = false,
  onEdit,
  onDelete,
}) => {
  const { mode } = useThemeMode()
  const isDark = mode === 'dark'

  const [showSkeleton, setShowSkeleton] = useState(false)

  useEffect(() => {
    if (loading) {
      setShowSkeleton(true)
    } else {
      const timeout = setTimeout(() => setShowSkeleton(false), 1000)
      return () => clearTimeout(timeout)
    }
  }, [loading])

  const skeletonRows: Purpose[] = Array.from({ length: 5 }).map((_, index) => ({
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

  const columns: TableColumn<Purpose>[] = [
    {
      name: '#',
      selector: (_, rowIndex) => (rowIndex ?? 0) + 1,
      cell: (_, rowIndex) => (showSkeleton ? <SkeletonCell /> : (rowIndex ?? 0) + 1),
      width: '60px',
      center: true,
      sortable: true,
    },
    {
      name: 'Purpose Name',
      selector: row => row.name,
      cell: row =>
        showSkeleton ? (
          <SkeletonCell />
        ) : (
          <div className="d-flex align-items-center justify-content-center">
            <div className="symbol symbol-35px symbol-circle bg-light-primary me-2">
              <div className="symbol-label text-primary">
                <i className="bi bi-bullseye fs-6"></i>
              </div>
            </div>
            <span className="fw-medium text-gray-800 fs-7">{row.name}</span>
          </div>
        ),
      sortable: true,
      wrap: true,
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
                <button className="dropdown-item" onClick={() => onEdit(row)}>
                  <i className="bi bi-pencil me-2"></i>Edit
                </button>
              </li>
              <li>
                <button className="dropdown-item text-danger" onClick={() => onDelete(row.id)}>
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
        backgroundColor: isDark ? '#1a1a1a' : '#f8f9fa',
        padding: '12px 15px',
        borderBottom: isDark ? '1px solid #333' : '1px solid #dee2e6',
      },
    },
  }

  return (
    <DataTable
      columns={columns}
      data={showSkeleton ? skeletonRows : purposes}
      customStyles={customStyles}
      striped
      highlightOnHover
      pointerOnHover
      responsive
      noHeader
    />
  )
}

export default PurposeList
