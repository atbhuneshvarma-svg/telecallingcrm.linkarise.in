import { FC } from 'react'

interface Props {
  currentPage: number
  totalPages: number
  totalRecords: number
  perPage: number
  onPageChange: (page: number) => void
  isLoading?: boolean
}

const Pagination: FC<Props> = ({
  currentPage,
  totalPages,
  totalRecords,
  perPage,
  onPageChange,
  isLoading = false
}) => {
  // Calculate start and end entries
  const startEntry = totalRecords === 0 ? 0 : (currentPage - 1) * perPage + 1
  const endEntry = Math.min(currentPage * perPage, totalRecords)

  // Generate page numbers with ellipsis for large page counts
  const getPageNumbers = () => {
    if (totalPages <= 1) return [1]
    
    const pages = []
    const maxVisiblePages = 5
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total pages is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Show first page, last page, and pages around current page
      if (currentPage <= 3) {
        // Near the start
        for (let i = 1; i <= 4; i++) {
          pages.push(i)
        }
        pages.push('...')
        pages.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        // Near the end
        pages.push(1)
        pages.push('...')
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        // In the middle
        pages.push(1)
        pages.push('...')
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i)
        }
        pages.push('...')
        pages.push(totalPages)
      }
    }
    
    return pages
  }

  // Handle no records
  if (totalRecords === 0) {
    return (
      <div className='d-flex align-items-center justify-content-between mt-4 pagination-container'>
        <div className='pagination-info text-muted'>No records found</div>
      </div>
    )
  }

  return (
    <div className='d-flex align-items-center justify-content-between mt-4 pagination-container'>
      {/* Records info - left side */}
      <div className='pagination-info text-muted'>
        {isLoading ? (
          <div className='d-flex align-items-center'>
            <div className='spinner-border spinner-border-sm text-primary me-2' role='status'>
              <span className='visually-hidden'>Loading...</span>
            </div>
            Loading...
          </div>
        ) : (
          `Showing ${startEntry} to ${endEntry} of ${totalRecords} entries`
        )}
      </div>
      
      {/* Page navigation - right side */}
      {totalPages > 1 && (
        <div className='btn-group pagination-controls'>
          {/* Previous button */}
          <button
            type='button'
            className='btn btn-sm btn-light btn-pagination'
            disabled={currentPage === 1 || isLoading}
            onClick={() => onPageChange(currentPage - 1)}
            aria-label="Go to previous page"
          >
            Previous
          </button>
          
          {/* Page numbers */}
          {getPageNumbers().map((page, index) => (
            <button
              key={index}
              type='button'
              className={`btn btn-sm btn-light btn-pagination ${
                page === currentPage ? 'active bg-primary text-white' : ''
              } ${page === '...' ? 'btn-ellipsis' : ''}`}
              disabled={page === '...' || isLoading}
              onClick={() => typeof page === 'number' && onPageChange(page)}
              aria-label={page === '...' ? 'More pages' : `Go to page ${page}`}
              aria-current={page === currentPage ? 'page' : undefined}
            >
              {page}
            </button>
          ))}
          
          {/* Next button */}
          <button
            type='button'
            className='btn btn-sm btn-light btn-pagination'
            disabled={currentPage >= totalPages || isLoading}
            onClick={() => onPageChange(currentPage + 1)}
            aria-label="Go to next page"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}

export { Pagination }