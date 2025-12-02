import React, { useState } from 'react';
import { Card, Alert, Spin, Row, Col } from 'antd';
import LeadReportHeader from './components/LeadReportHeader';
import LeadReportFilters from './components/LeadReportFilters';
import LeadReportTable from './components/LeadReportTable';
import LeadReportPagination from './components/LeadReportPagination';
import { useLeadReport } from './hooks/useLeadReport';
import { FilterState } from './core/types';

const LeadReportPage: React.FC = () => {
  const [filters, setFilters] = useState<FilterState>({
    campaign: 'All',
    status: '',
    user: '',
    team: '',
    dateFrom: '',
    dateTo: '',
    page: 1,
    perPage: 10
  });

  const {
    data: reportData,
    isLoading,
    isError,
    error,
    refetch,
    isFetching
  } = useLeadReport(filters);

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  return (
    <div style={{ padding: 24 }}>
      <Card>
        {/* Pass leads data to LeadReportHeader */}
        <LeadReportHeader
          onRefresh={() => refetch()}
          leads={reportData?.data || []}
          isLoading={isFetching}
        />

        <LeadReportFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          campaigns={reportData?.campaigns || []}
          users={reportData?.users || []}
          statuses={reportData?.status || []}
          teams={reportData?.teams || []}
        />

        {isError && (
          <Alert
            message="Error"
            description={error instanceof Error ? error.message : 'Failed to load lead report'}
            type="error"
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}

        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <Spin size="large" />
          </div>
        ) : (
          <>
            <LeadReportTable 
              leads={reportData?.data || []} 
              loading={isFetching}
            />
            
            {reportData && reportData.total_records > 0 && (
              <LeadReportPagination
                currentPage={filters.page}
                totalRecords={reportData.total_records}
                perPage={filters.perPage}
                onPageChange={handlePageChange}
                onPerPageChange={(perPage) => handleFilterChange({ perPage })}
              />
            )}
          </>
        )}
      </Card>
    </div>
  );
};

export default LeadReportPage;