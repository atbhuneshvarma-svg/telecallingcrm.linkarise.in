// src/app/modules/apps/reports/allleadreport/components/LeadReportPagination/LeadReportPagination.tsx
import React from 'react';
import { Pagination, Select, Space, Typography } from 'antd';
import type { PaginationProps } from 'antd';

const { Option } = Select;
const { Text } = Typography;

interface LeadReportPaginationProps {
  currentPage: number;
  totalRecords: number;
  perPage: number;
  onPageChange: (page: number) => void;
  onPerPageChange: (perPage: number) => void;
}

const LeadReportPagination: React.FC<LeadReportPaginationProps> = ({
  currentPage,
  totalRecords,
  perPage,
  onPageChange,
  onPerPageChange,
}) => {
  const handlePageChange: PaginationProps['onChange'] = (page) => {
    onPageChange(page);
  };

  const handlePerPageChange = (value: number) => {
    onPerPageChange(value);
  };

  const showingFrom = (currentPage - 1) * perPage + 1;
  const showingTo = Math.min(currentPage * perPage, totalRecords);

  return (
    <Space style={{ width: '100%', justifyContent: 'space-between', marginTop: 16 }}>
      <Text type="secondary">
        Showing {showingFrom} to {showingTo} of {totalRecords} entries
      </Text>
      
      <Space>
        <Select
          value={perPage}
          onChange={handlePerPageChange}
          style={{ width: 120 }}
        >
          <Option value={10}>10 / page</Option>
          <Option value={25}>25 / page</Option>
          <Option value={50}>50 / page</Option>
          <Option value={100}>100 / page</Option>
        </Select>
        
        <Pagination
          current={currentPage}
          total={totalRecords}
          pageSize={perPage}
          onChange={handlePageChange}
          showSizeChanger={false}
          showQuickJumper
        />
      </Space>
    </Space>
  );
};

export default LeadReportPagination;