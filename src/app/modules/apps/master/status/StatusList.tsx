import React, { useState, useEffect } from 'react'
import DataTable, { TableColumn } from 'react-data-table-component'
import { Status } from './core/_request'
import { useThemeMode } from '../../../../../_metronic/partials/layout/theme-mode/ThemeModeProvider'

interface StatusListProps {
  statuses: Status[]
  loading?: boolean
  onEditStatus: (status: Status) => void
  onDeleteStatus: (id: number) => void
}

const StatusList: React.FC<StatusListProps> = ({
  statuses,
  loading = false,
  onEditStatus,
  onDeleteStatus,
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

  const skeletonRows: Status[] = Array.from({ length: 5 }).map((_, index) => ({
    id: index,
    name: '',
    color: '',
    stage: '',
  }))

  const SkeletonCell = () => (
    <div className="placeholder-wave w-100">
      <span
        className="placeholder col-12"
        style={{ height: '20px', display: 'block', borderRadius: '4px' }}
      />
    </div>
  )

  const columns: TableColumn<Status>[] = [
    {
      name: '#',
      selector: (_, rowIndex) => (rowIndex ?? 0) + 1, // safe row numbering
      cell: (_, rowIndex) => (showSkeleton ? <SkeletonCell /> : (rowIndex ?? 0) + 1),
      width: '60px',
      center: true,
      sortable: true,
    },
    {
      name: 'Status Name',
      selector: row => row.name,
      cell: row => showSkeleton ? <SkeletonCell /> : (
        <div
          style={{ backgroundColor: row.color, padding: '15px', borderRadius: '8px', paddingBottom: '20px' }}
          className="d-flex flex-column"
        >
          <span className="fw-bold text-white fs-7">{row.name}</span>
        </div>
      ),
      sortable: true,
    },
    {
      name: 'Status Color',
      selector: row => row.color,
      cell: row => showSkeleton ? <SkeletonCell /> : <span className="badge badge-light fs-7">{row.color}</span>,
      sortable: true,
    },
    {
      name: 'Stage',
      selector: row => row.stage,
      cell: row => showSkeleton ? <SkeletonCell /> : row.stage,
      sortable: true,
    },
    {
      name: 'Actions',
      cell: row => showSkeleton ? <SkeletonCell /> : (
        <div className="dropdown">
          <button className="btn btn-sm btn-light btn-active-light-primary" type="button" data-bs-toggle="dropdown" aria-expanded="false">
            Actions <i className="bi bi-chevron-down ms-2"></i>
          </button>
          <ul className="dropdown-menu">
            <li>
              <button className="dropdown-item" onClick={() => onEditStatus(row)}>
                <i className="bi bi-pencil me-2"></i>Edit
              </button>
            </li>
            <li>
              <button className="dropdown-item text-danger" onClick={() => onDeleteStatus(row.id)}>
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
      data={showSkeleton ? skeletonRows : statuses}
      customStyles={customStyles}
      striped
      highlightOnHover
      pointerOnHover
      responsive
      noHeader
    />
  )
}

export default StatusList
