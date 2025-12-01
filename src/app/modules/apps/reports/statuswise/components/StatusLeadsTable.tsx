// src/app/modules/apps/leads/statuswise/components/Table/StatusLeadsTable.tsx
import React from 'react'
import DataTable, { TableColumn } from 'react-data-table-component'
import { LeadStatusData } from '../core/_models'
import { format } from 'date-fns'

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
  const columns: TableColumn<LeadStatusData>[] = [
    {
      name: 'Sr.No',
      cell: (row, index) => (
        <div className="text-center">
          {index + 1 + (pagination.current_page - 1) * pagination.per_page}
        </div>
      ),
      width: '80px',
      center: true
    },
    {
      name: 'Campaign',
      selector: row => row.campaign,
      sortable: true,
    },
    {
      name: 'User',
      selector: row => row.telecaller,
      sortable: true,
    },
    {
      name: 'Lead Name',
      selector: row => row.prospectname,
      sortable: true,
    },
    {
      name: 'Mobile',
      selector: row => row.mobile,
      center: true,
    },
    {
      name: 'Status',
      selector: row => row.statusname,
      sortable: true,
    },
    {
      name: 'Status Date',
      selector: row => format(new Date(row.statusdate), 'dd-MM-yyyy'),
      sortable: true,
      center: true,
    },
    {
      name: 'Added On',
      selector: row => format(new Date(row.created_at), 'dd-MM-yyyy'),
      sortable: true,
      center: true,
    },
  ]

  return (
    <div className="table-responsive">
      {/* Entries Selector */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div style={{ fontSize: '14px', color: '#666' }}>
          Show
          <select 
            className="form-select form-select-sm d-inline-block mx-2" 
            style={{ width: 'auto' }}
            value={pagination.per_page}
            onChange={(e) => onRowsPerPageChange(Number(e.target.value))}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          entries
        </div>
      </div>

      <DataTable
        columns={columns}
        data={leads}
        progressPending={isLoading}
        pagination
        paginationServer
        paginationTotalRows={pagination.total}
        paginationDefaultPage={pagination.current_page}
        onChangePage={onPageChange}
        onChangeRowsPerPage={onRowsPerPageChange}
        paginationRowsPerPageOptions={[10, 25, 50, 100]}
        customStyles={{
          headCells: {
            style: {
              backgroundColor: '#f8f9fa',
              color: '#333',
              fontWeight: '600',
              fontSize: '14px',
              borderBottom: '2px solid #dee2e6',
              padding: '12px 15px'
            },
          },
          cells: {
            style: {
              fontSize: '14px',
              padding: '12px 15px',
              borderBottom: '1px solid #dee2e6'
            },
          },
          rows: {
            style: {
              '&:hover': {
                backgroundColor: '#f5f5f5'
              }
            }
          }
        }}
        noDataComponent={
          <div className="text-center py-5">
            <i className="bi bi-inbox display-4 text-muted mb-3"></i>
            <p className="text-muted">No data available in table</p>
          </div>
        }
      />
    </div>
  )
}

export default StatusLeadsTable