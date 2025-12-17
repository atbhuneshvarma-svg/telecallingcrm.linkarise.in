import React from 'react'
import { Pagination as BootstrapPagination, Form, Row, Col } from 'react-bootstrap'

interface PaginationProps {
  currentPage: number
  totalPages: number
  totalRecords: number
  perPage: number
  onPageChange: (page: number) => void
  onPerPageChange: (perPage: number) => void
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalRecords,
  perPage,
  onPageChange,
  onPerPageChange
}) => {
  const getPageNumbers = () => {
    const pages = []
    const showPages = 5
    
    let startPage = Math.max(1, currentPage - Math.floor(showPages / 2))
    let endPage = Math.min(totalPages, startPage + showPages - 1)
    
    if (endPage - startPage + 1 < showPages) {
      startPage = Math.max(1, endPage - showPages + 1)
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }
    
    return pages
  }

  return (
    <Row className="align-items-center mt-4">
      <Col md={6}>
        <div className="d-flex align-items-center">
          <span className="text-muted me-2">Show</span>
          <Form.Select
            value={perPage}
            onChange={(e) => onPerPageChange(Number(e.target.value))}
            style={{ width: 'auto' }}
            size="sm"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </Form.Select>
          <span className="text-muted ms-2">entries</span>
        </div>
      </Col>
      
      <Col md={6}>
        <div className="d-flex justify-content-end">
          <BootstrapPagination className="mb-0">
            <BootstrapPagination.First
              onClick={() => onPageChange(1)}
              disabled={currentPage === 1}
            />
            <BootstrapPagination.Prev
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
            />
            
            {getPageNumbers().map(page => (
              <BootstrapPagination.Item
                key={page}
                active={page === currentPage}
                onClick={() => onPageChange(page)}
              >
                {page}
              </BootstrapPagination.Item>
            ))}
            
            <BootstrapPagination.Next
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            />
            <BootstrapPagination.Last
              onClick={() => onPageChange(totalPages)}
              disabled={currentPage === totalPages}
            />
          </BootstrapPagination>
        </div>
      </Col>
    </Row>
  )
}