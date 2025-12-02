import React from 'react';
import { Container, Alert } from 'react-bootstrap';
import { useLeadSummary } from './hooks/useLeadSummary';
import { exportToExcel } from './core/services';
import LeadSummaryHeader from './components/LeadSummaryHeader';
import LeadSummaryFilters from './components/LeadSummaryFilters';
import LeadSummaryTable from './components/LeadSummaryTable';
import LeadSummaryPagination from './components/LeadSummaryPagination';

const LeadSummaryPage: React.FC = () => {
  const {
    data,
    loading, // Changed from isLoading to loading
    error,
    filters,
    pagination,
    handleSearch,
    handlePageSizeChange,
    handlePageChange,
    refetch,
  } = useLeadSummary();

  const handleExport = () => {
    exportToExcel(data);
  };

  return (
    <Container fluid className="py-4">
      <LeadSummaryHeader />
      
      <div className="card shadow-sm">
        <div className="card-body">
          <LeadSummaryFilters
            pageSize={filters.perPage}
            searchTerm={filters.search || ''}
            onPageSizeChange={handlePageSizeChange}
            onSearchChange={handleSearch}
            onExport={handleExport}
          />
          
          {error && (
            <Alert variant="danger" className="mb-3">
              Error: {error.message}
              <button 
                className="btn btn-sm btn-outline-danger ms-2"
                onClick={() => refetch()}
              >
                Retry
              </button>
            </Alert>
          )}
          
          <LeadSummaryTable
            data={data}
            loading={loading} // Changed from isLoading to loading
          />
          
          {pagination && pagination.totalPages > 1 && (
            <LeadSummaryPagination
              pagination={pagination}
              onPageChange={handlePageChange}
            />
          )}
          
          <div className="mt-4 pt-3 border-top">
            <div className="d-flex justify-content-between align-items-center">
              <div className="text-muted" style={{ fontSize: '0.875rem' }}>
                Data last updated: {new Date().toLocaleDateString()}
              </div>
              <button 
                className="btn btn-link text-decoration-none"
                onClick={() => refetch()}
                disabled={loading} // Changed from isLoading to loading
              >
                Refresh Data
              </button>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default LeadSummaryPage;