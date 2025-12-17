import React, { useMemo } from 'react';
import { Button, Row, Col, Form } from 'react-bootstrap';

interface FollowupPaginationProps {
  currentPage: number;
  totalPages: number;
  totalEntries: number;
  startIndex: number;
  endIndex: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void; // Optional page size change handler
  pageSizeOptions?: number[]; // Custom page size options
  showPageSizeSelector?: boolean; // Toggle page size selector
}

const FollowupPagination: React.FC<FollowupPaginationProps> = ({
  currentPage,
  totalPages,
  totalEntries,
  startIndex,
  endIndex,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50, 100],
  showPageSizeSelector = false,
}) => {
  // Memoized page numbers calculation for better performance
  const { pageNumbers, showStartEllipsis, showEndEllipsis } = useMemo(() => {
    const maxVisiblePages = 5;
    const pages = [];
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    // Adjust start page if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return {
      pageNumbers: pages,
      showStartEllipsis: startPage > 1,
      showEndEllipsis: endPage < totalPages
    };
  }, [currentPage, totalPages]);

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = Number(e.target.value);
    onPageSizeChange?.(newSize);
    // Reset to first page when changing page size
    onPageChange(1);
  };

  const goToFirstPage = () => onPageChange(1);
  const goToLastPage = () => onPageChange(totalPages);

  // Calculate showing text with proper grammar
  const showingText = useMemo(() => {
    if (totalEntries === 0) return 'No entries found';
    
    const from = startIndex + 1;
    const to = Math.min(endIndex, totalEntries);
    
    return `Showing ${from} to ${to} of ${totalEntries} ${totalEntries === 1 ? 'entry' : 'entries'}`;
  }, [startIndex, endIndex, totalEntries]);

  // Calculate page info
  const pageInfo = useMemo(() => {
    if (totalPages === 0) return 'Page 0 of 0';
    return `Page ${currentPage} of ${totalPages}`;
  }, [currentPage, totalPages]);

  if (totalPages <= 1 && totalEntries === 0) {
    return null; // Don't show pagination if no data
  }

  return (
    <Row className="mt-4 align-items-center">
      {/* Left Side - Showing Info & Page Size Selector */}
      <Col md={6} className="mb-2 mb-md-0">
        <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center gap-2">
          <div>
            <p className="text-muted mb-0 small fw-semibold">
              {showingText}
            </p>
            {totalPages > 0 && (
              <p className="text-muted mb-0 small">
                {pageInfo}
              </p>
            )}
          </div>
          
          {showPageSizeSelector && onPageSizeChange && (
            <div className="d-flex align-items-center gap-2">
              <span className="text-muted small">Show:</span>
              <Form.Select
                size="sm"
                style={{ width: '80px' }}
                value={endIndex - startIndex}
                onChange={handlePageSizeChange}
                className="border-primary"
              >
                {pageSizeOptions.map(size => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </Form.Select>
            </div>
          )}
        </div>
      </Col>

      {/* Right Side - Pagination Controls */}
      <Col md={6}>
        <div className="d-flex flex-column flex-md-row align-items-center justify-content-md-end gap-2">
          {/* Mobile-friendly page info */}
          <div className="d-md-none text-center">
            <span className="badge bg-primary">
              {currentPage} / {totalPages}
            </span>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <nav aria-label="Follow-up leads pagination">
              <ul className="pagination pagination-sm mb-0 flex-wrap justify-content-center">
                {/* First Page */}
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="page-link border-end-0"
                    onClick={goToFirstPage}
                    disabled={currentPage === 1}
                    aria-label="Go to first page"
                  >
                    <i className="bi bi-chevron-double-left"></i>
                  </Button>
                </li>

                {/* Previous Page */}
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="page-link border-start-0"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    aria-label="Go to previous page"
                  >
                    <i className="bi bi-chevron-left"></i>
                  </Button>
                </li>

                {/* Start Ellipsis */}
                {showStartEllipsis && (
                  <li className="page-item disabled">
                    <span className="page-link border-0">...</span>
                  </li>
                )}

                {/* Page Numbers */}
                {pageNumbers.map(page => (
                  <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                    <Button
                      variant={currentPage === page ? "primary" : "outline-primary"}
                      size="sm"
                      className="page-link"
                      onClick={() => onPageChange(page)}
                      aria-label={`Go to page ${page}`}
                      aria-current={currentPage === page ? 'page' : undefined}
                    >
                      {page}
                    </Button>
                  </li>
                ))}

                {/* End Ellipsis */}
                {showEndEllipsis && (
                  <li className="page-item disabled">
                    <span className="page-link border-0">...</span>
                  </li>
                )}

                {/* Next Page */}
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="page-link border-end-0"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    aria-label="Go to next page"
                  >
                    <i className="bi bi-chevron-right"></i>
                  </Button>
                </li>

                {/* Last Page */}
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="page-link border-start-0"
                    onClick={goToLastPage}
                    disabled={currentPage === totalPages}
                    aria-label="Go to last page"
                  >
                    <i className="bi bi-chevron-double-right"></i>
                  </Button>
                </li>
              </ul>
            </nav>
          )}

          {/* Quick Jump (Optional) */}
          {totalPages > 10 && (
            <div className="d-flex align-items-center gap-2">
              <span className="text-muted small">Go to:</span>
              <Form.Control
                type="number"
                size="sm"
                min={1}
                max={totalPages}
                style={{ width: '70px' }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    const page = Number((e.target as HTMLInputElement).value);
                    if (page >= 1 && page <= totalPages) {
                      onPageChange(page);
                      (e.target as HTMLInputElement).value = '';
                    }
                  }
                }}
                placeholder="Page"
              />
            </div>
          )}
        </div>
      </Col>
    </Row>
  );
};

export default React.memo(FollowupPagination);