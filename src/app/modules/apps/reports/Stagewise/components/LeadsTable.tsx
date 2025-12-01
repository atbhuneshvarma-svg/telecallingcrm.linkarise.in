// components/LeadsTable.tsx
import React from 'react'
import DataTable, { TableColumn } from 'react-data-table-component'
import { format } from 'date-fns'
import { Lead, Pagination } from '../core/types'

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
  const columns: TableColumn<Lead>[] = [
    { 
      name: 'Sr.No', 
      cell: (row, index) => (
        <div>{index !== undefined ? index + 1 + (pagination.page - 1) * pagination.per_page : 'N/A'}</div>
      ),
      width: '80px'
    },
    { name: 'Campaign', selector: row => row.campaign, sortable: true },
    { name: 'User', selector: row => row.telecaller, sortable: true },
    { name: 'Lead Name', selector: row => row.prospectname, sortable: true },
    { name: 'Mobile', selector: row => row.mobile },
    { name: 'Stage', selector: row => row.stage, sortable: true },
    { 
      name: 'Stage Date', 
      selector: row => format(new Date(row.stagedate), 'dd-MM-yyyy'),
      sortable: true 
    },
    { 
      name: 'Added On', 
      selector: row => format(new Date(row.created_at), 'dd-MM-yyyy'),
      sortable: true 
    },
  ]

  return (
    <DataTable
      columns={columns}
      data={leads}
      progressPending={loading}
      pagination
      paginationServer
      paginationTotalRows={pagination.total}
      onChangePage={onPageChange}
      paginationRowsPerPageOptions={[10, 25, 50, 100]}
      noDataComponent="No leads found"
    />
  )
}

export default LeadsTable