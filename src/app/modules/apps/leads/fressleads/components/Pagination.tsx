// components/Pagination.tsx
import React from 'react';
import { Pagination as BootstrapPagination, Form } from 'react-bootstrap';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  perPage: number;
  onPageChange: (page: number) => void;
  onPerPageChange?: (perPage: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalRecords,
  perPage,
  onPageChange,
  onPerPageChange,
}) => {
  const getPageNumbers = () => {
    if (totalPages <= 1) return [];

    const pages = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  const startRecord = (currentPage - 1) * perPage + 1;
  const endRecord = Math.min(currentPage * perPage, totalRecords);

  if (totalRecords === 0) return null;

  return (
    <div className="d-flex justify-content-between align-items-center mt-4">
      <div className="text-muted p-5">
        Showing {startRecord} to {endRecord} of {totalRecords} entries
      </div>

      <div className="d-flex align-items-center gap-3">
        {totalPages > 1 && (
          <BootstrapPagination className="mb-0">
            <BootstrapPagination.First
              onClick={() => onPageChange(1)}
              disabled={currentPage === 1}
            />
            <BootstrapPagination.Prev
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
            />

            {getPageNumbers().map((page) => (
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
        )}
      </div>
    </div>
  );
};
