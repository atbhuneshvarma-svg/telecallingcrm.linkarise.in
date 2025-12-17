import React, { useMemo } from 'react';
import { Button, Row, Col, Form } from 'react-bootstrap';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  perPage: number;
  onPageChange: (page: number) => void;
  onPerPageChange?: (perPage: number) => void;
  showingFrom?: number;
  showingTo?: number;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalRecords,
  perPage,
  onPageChange,
  onPerPageChange,
  showingFrom = 0,
  showingTo = 0,
}) => {
  // Calculate showing range
  const calculatedShowingFrom = showingFrom || (currentPage - 1) * perPage + 1;
  const calculatedShowingTo = showingTo || Math.min(currentPage * perPage, totalRecords);

  // Generate page numbers with ellipsis
  const pageNumbers = useMemo(() => {
    if (totalPages <= 1) return { pages: [], showStartEllipsis: false, showEndEllipsis: false };

    const pages = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    // Adjust if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return {
      pages,
      showStartEllipsis: startPage > 1,
      showEndEllipsis: endPage < totalPages
    };
  }, [currentPage, totalPages]);

  const handlePerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newPerPage = Number(e.target.value);
    onPerPageChange?.(newPerPage);
    onPageChange(1); // Reset to first page
  };

  const handlePageInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const page = Number((e.target as HTMLInputElement).value);
      if (page >= 1 && page <= totalPages) {
        onPageChange(page);
        (e.target as HTMLInputElement).value = '';
      }
    }
  };

  const goToFirstPage = () => onPageChange(1);
  const goToLastPage = () => onPageChange(totalPages);
  const goToPrevPage = () => onPageChange(Math.max(1, currentPage - 1));
  const goToNextPage = () => onPageChange(Math.min(totalPages, currentPage + 1));

  if (totalPages <= 1 && totalRecords === 0) {
    return null;
  }

  return (
    <Row className="align-items-center mt-4">
      {/* Left Side - Showing Info & Per Page Selector */}
      <Col md={6} className="mb-3 mb-md-0">
        <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center gap-3">
          {/* Showing Info */}
          <div>

            {totalPages > 0 && (
              <p className="text-muted mb-0 small">
                Page {currentPage} of {totalPages}
              </p>
            )}
          </div>

        </div>
      </Col>

      {/* Right Side - Pagination Controls */}
      <Col md={6}>
        <div className="d-flex flex-column flex-md-row align-items-center justify-content-md-end gap-3">
          {/* Mobile Page Info */}
          <div className="d-md-none">
            <span className="badge bg-primary">
              {currentPage} / {totalPages}
            </span>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <nav aria-label="Pagination">
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
                    First
                  </Button>
                </li>



                {/* Start Ellipsis */}
                {pageNumbers.showStartEllipsis && (
                  <li className="page-item disabled">
                    <span className="page-link border-0">...</span>
                  </li>
                )}

                {/* Page Numbers */}
                {pageNumbers.pages.map(page => (
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
                {pageNumbers.showEndEllipsis && (
                  <li className="page-item disabled">
                    <span className="page-link border-0">...</span>
                  </li>
                )}



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
                    Last
                  </Button>
                </li>
              </ul>
            </nav>
          )}

          {/* Quick Page Jump */}
          {totalPages > 10 && (
            <div className="d-flex align-items-center gap-2">
              <span className="text-muted small">Go to:</span>
              <Form.Control
                type="number"
                size="sm"
                min={1}
                max={totalPages}
                style={{ width: '70px' }}
                onKeyPress={handlePageInput}
                placeholder={currentPage.toString()}
              />
            </div>
          )}
        </div>
      </Col>
    </Row>
  );
};

export default Pagination;