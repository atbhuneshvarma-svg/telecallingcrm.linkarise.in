import React from 'react';
import { Button, Row, Col } from 'react-bootstrap';

interface CallDetailsPaginationProps {
  currentPage: number;
  totalPages: number;
  totalEntries: number;
  startIndex: number;
  endIndex: number;
  onPageChange: (page: number) => void;
}

const CallDetailsPagination: React.FC<CallDetailsPaginationProps> = ({
  currentPage,
  totalPages,
  totalEntries,
  startIndex,
  endIndex,
  onPageChange,
}) => {
  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <li key={i} className={`page-item ${currentPage === i ? 'active' : ''}`}>
          <Button
            variant="outline-primary"
            size="sm"
            className="page-link"
            onClick={() => onPageChange(i)}
          >
            {i}
          </Button>
        </li>
      );
    }
    
    return pages;
  };

  return (
    <Row className="mt-3 align-items-center">
      <Col md={6}>
        <p className="text-muted mb-0">
          Showing {startIndex + 1} to {Math.min(endIndex, totalEntries)} of {totalEntries} entries
        </p>
      </Col>
      <Col md={6}>
        <div className="d-flex justify-content-end">
          <nav>
            <ul className="pagination pagination-sm mb-0">
              <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                <Button
                  variant="outline-primary"
                  size="sm"
                  className="page-link"
                  onClick={() => onPageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
              </li>
              {renderPageNumbers()}
              <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                <Button
                  variant="outline-primary"
                  size="sm"
                  className="page-link"
                  onClick={() => onPageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </li>
            </ul>
          </nav>
        </div>
      </Col>
    </Row>
  );
};

export default CallDetailsPagination;