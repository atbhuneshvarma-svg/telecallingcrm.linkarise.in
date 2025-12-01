// src/app/modules/apps/leads/statuswise/components/Summary/TableSummary.tsx
import React from 'react'

interface TableSummaryProps {
  from: number
  to: number
  total: number
  currentPage: number
  totalPages: number
}

const TableSummary: React.FC<TableSummaryProps> = ({
  from,
  to,
  total,
  currentPage,
  totalPages
}) => {
  return (
    <div className="d-flex justify-content-between align-items-center mt-3">
      <div style={{ fontSize: '14px', color: '#666' }}>
        Showing {from || 0} to {to || 0} of {total} entries
      </div>
      <div style={{ fontSize: '14px', color: '#666' }}>
        Page {currentPage} of {totalPages}
      </div>
    </div>
  )
}

export default TableSummary