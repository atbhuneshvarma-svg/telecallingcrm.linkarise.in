import React, { useCallback } from 'react';

interface PaginationInfo {
  current_page: number;
  per_page: number;
  total_records: number;
  total_pages: number;
}

interface ActivityLogsPaginationProps {
  logs: PaginationInfo;
  loading: boolean;
  onPageChange: (page: number) => void;
}

export const ActivityLogsPagination: React.FC<ActivityLogsPaginationProps> = ({
  logs,
  loading,
  onPageChange,
}) => {
  const generatePaginationNumbers = useCallback(() => {
    const currentPage = logs.current_page;
    const totalPages = logs.total_pages;
    
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage <= 3) {
      return [1, 2, 3, 4, '...', totalPages];
    }

    if (currentPage >= totalPages - 2) {
      return [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }

    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
  }, [logs]);

  return (
    <div className="d-flex justify-content-between align-items-center mt-4">
      <div className="text-muted">
        Showing {((logs.current_page - 1) * logs.per_page) + 1} to {Math.min(logs.current_page * logs.per_page, logs.total_records)} of {logs.total_records} entries
      </div>
      
      <nav>
        <ul className="pagination pagination-sm">
          {/* Previous Button */}
          <li className={`page-item ${logs.current_page === 1 ? 'disabled' : ''}`}>
            <button
              className="page-link"
              onClick={() => onPageChange(logs.current_page - 1)}
              disabled={logs.current_page === 1 || loading}
            >
              Previous
            </button>
          </li>
          
          {/* Page Numbers */}
          {generatePaginationNumbers().map((page, index) => (
            <li 
              key={index} 
              className={`page-item ${page === logs.current_page ? 'active' : ''} ${page === '...' ? 'disabled' : ''}`}
            >
              {page === '...' ? (
                <span className="page-link">...</span>
              ) : (
                <button
                  className="page-link"
                  onClick={() => onPageChange(page as number)}
                  disabled={loading}
                >
                  {page}
                </button>
              )}
            </li>
          ))}
          
          {/* Next Button */}
          <li className={`page-item ${logs.current_page === logs.total_pages ? 'disabled' : ''}`}>
            <button
              className="page-link"
              onClick={() => onPageChange(logs.current_page + 1)}
              disabled={logs.current_page === logs.total_pages || loading}
            >
              Next
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};