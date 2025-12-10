import { Skeleton } from 'antd'
import React, { useMemo } from 'react'



interface LeadsPaginationProps {
  currentPage: number
  totalPages: number
  totalRecords: number
  onPageChange: (page: number) => void
  onPageSizeChange?: (pageSize: number) => void
  showingFrom: number
  showingTo: number
  loading?: boolean
  pageSize?: number
  pageSizeOptions?: number[]
  showPageSizeSelector?: boolean
  compact?: boolean
}

const LeadsPagination: React.FC<LeadsPaginationProps> = ({
  currentPage,
  totalPages,
  totalRecords,
  onPageChange,
  onPageSizeChange,
  showingFrom,
  showingTo,
  loading = false,
  pageSize = 10,
  pageSizeOptions = [10, 25, 50, 100],
  showPageSizeSelector = true,
  compact = false
}) => {

  // Memoized visible pages calculation
  const visiblePages = useMemo(() => {
    const getVisiblePages = () => {
      if (totalPages <= 1) return []

      const pages = []
      const maxVisible = compact ? 3 : 5
      let start = Math.max(1, currentPage - Math.floor(maxVisible / 2))
      let end = Math.min(totalPages, start + maxVisible - 1)

      if (end - start < maxVisible - 1) {
        start = Math.max(1, end - maxVisible + 1)
      }

      for (let i = start; i <= end; i++) {
        pages.push(i)
      }

      return pages
    }

    return getVisiblePages()
  }, [currentPage, totalPages, compact])

  // Memoized pagination info
  const paginationInfo = useMemo(() => {
    const hasRecords = totalRecords > 0
    const isFiltered = showingTo < totalRecords || showingFrom > 1

    return {
      hasRecords,
      isFiltered,
      showPagination: totalPages > 1 && hasRecords,
      showFirstLast: totalPages > (compact ? 5 : 7)
    }
  }, [totalRecords, showingFrom, showingTo, totalPages, compact])

  // Handle page size change
  const handlePageSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = parseInt(event.target.value)
    onPageSizeChange?.(newSize)
  }

  // Generate page buttons with proper accessibility
  const renderPageButtons = () => {
    if (!paginationInfo.showPagination) return null

    return (
      <nav aria-label="Leads pagination">
        <ul className="pagination pagination-sm mb-0">
          {/* First Page Button */}
          {paginationInfo.showFirstLast && (
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <button
                className="page-link"
                onClick={() => onPageChange(1)}
                disabled={currentPage === 1 || loading}
                aria-label="Go to first page"
              >
                <i className="bi bi-chevron-double-left"></i>
              </button>
            </li>
          )}

          {/* Previous Page Button */}
          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
            <button
              className="page-link"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1 || loading}
              aria-label="Go to previous page"
            >
              <i className="bi bi-chevron-left"></i>
            </button>
          </li>

          {/* Ellipsis for beginning */}
          {visiblePages[0] > 1 && (
            <>
              <li className="page-item">
                <button
                  className="page-link"
                  onClick={() => onPageChange(1)}
                  disabled={loading}
                >
                  1
                </button>
              </li>
              {visiblePages[0] > 2 && (
                <li className="page-item disabled">
                  <span className="page-link">...</span>
                </li>
              )}
            </>
          )}

          {/* Page Number Buttons */}
          {visiblePages.map(page => (
            <li
              key={page}
              className={`page-item ${currentPage === page ? 'active' : ''}`}
            >
              <button
                className="page-link"
                onClick={() => onPageChange(page)}
                disabled={loading}
                aria-label={`Go to page ${page}`}
                aria-current={currentPage === page ? 'page' : undefined}
              >
                {page}
                {currentPage === page && (
                  <span className="visually-hidden">(current)</span>
                )}
              </button>
            </li>
          ))}

          {/* Ellipsis for end */}
          {visiblePages[visiblePages.length - 1] < totalPages && (
            <>
              {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
                <li className="page-item disabled">
                  <span className="page-link">...</span>
                </li>
              )}
              <li className="page-item">
                <button
                  className="page-link"
                  onClick={() => onPageChange(totalPages)}
                  disabled={loading}
                >
                  {totalPages}
                </button>
              </li>
            </>
          )}

          {/* Next Page Button */}
          <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
            <button
              className="page-link"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages || loading}
              aria-label="Go to next page"
            >
              <i className="bi bi-chevron-right"></i>
            </button>
          </li>

          {/* Last Page Button */}
          {paginationInfo.showFirstLast && (
            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
              <button
                className="page-link"
                onClick={() => onPageChange(totalPages)}
                disabled={currentPage === totalPages || loading}
                aria-label="Go to last page"
              >
                <i className="bi bi-chevron-double-right"></i>
              </button>
            </li>
          )}
        </ul>
      </nav>
    )
  }

  if (!paginationInfo.hasRecords && !loading) {
    return (
      <div className="card-footer bg-transparent border-0">
        <div className="text-center text-muted py-4">
          <i className="bi bi-inbox fs-1 opacity-50"></i>
          <p className="mt-2 mb-0">No leads found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="card-footer bg-transparent border-top">
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
        {/* Results Info */}
        <div className="d-flex align-items-center gap-3">
          {loading ? (
            <div className="d-flex align-items-center text-muted">
              <Skeleton.Button style={{ width: 80 }} active size="small" />
            </div>
          ) : (
            <>
              <div className="text-muted">
                Showing <strong>{showingFrom.toLocaleString()}</strong> to{' '}
                <strong>{showingTo.toLocaleString()}</strong> of{' '}
                <strong>{totalRecords.toLocaleString()}</strong> entries
                {paginationInfo.isFiltered && (
                  <span className="text-primary ms-1">
                    (filtered)
                  </span>
                )}
              </div>

              {/* Page Size Selector */}
              {showPageSizeSelector && onPageSizeChange && (
                <div className="d-flex align-items-center gap-2">
                  <label htmlFor="pageSizeSelect" className="form-label text-muted mb-0 fs-7">
                    Show:
                  </label>
                  <select
                    id="pageSizeSelect"
                    className="form-select form-select-sm"
                    value={pageSize}
                    onChange={handlePageSizeChange}
                    disabled={loading}
                    style={{ width: '80px' }}
                  >
                    {pageSizeOptions.map(size => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </>
          )}
        </div>

        {/* Pagination Controls */}
        {renderPageButtons()}

        {/* Quick Page Info */}
        {paginationInfo.showPagination && !compact && (
          <div className="d-flex align-items-center gap-2 text-muted fs-7">
            <span>Page</span>
            <strong>{currentPage.toLocaleString()}</strong>
            <span>of</span>
            <strong>{totalPages.toLocaleString()}</strong>
          </div>
        )}
      </div>

      {/* Loading Progress Bar */}
      {loading && (
        <div className="progress mt-3" style={{ height: '3px' }}>
          <div
            className="progress-bar progress-bar-striped progress-bar-animated"
            style={{ width: '100%' }}
          ></div>
        </div>
      )}
    </div>
  )
}

export default LeadsPagination