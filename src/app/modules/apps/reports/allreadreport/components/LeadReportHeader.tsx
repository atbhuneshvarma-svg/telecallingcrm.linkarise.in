import React, { useState } from 'react';
import { Typography, Space, Button, Dropdown, message } from 'antd';
import {
  DownloadOutlined,
  ReloadOutlined,
  FileExcelOutlined,
  FileTextOutlined,
  FilePdfOutlined
} from '@ant-design/icons';
import { exportToExcel, exportToCSV, exportToPDF } from '../utils/exportUtils';
import { LeadData } from '../core/types';

const { Title } = Typography;

interface ExportFilters {
  status_filter?: string;
  campaign_filter?: string;
  user_filter?: string;
  team_filter?: string;
  date_from?: string;
  date_to?: string;
  per_page?: string;
}

interface LeadReportHeaderProps {
  onRefresh: () => void;
  leads?: LeadData[];
  isLoading?: boolean;
  filters?: {
    status?: string;
    campaignmid?: string;
    usermid?: string;
    tmid?: string;
    dateFrom?: string;
    dateTo?: string;
  };
}

const LeadReportHeader: React.FC<LeadReportHeaderProps> = ({
  onRefresh,
  leads = [],
  isLoading,
  filters = {}
}) => {
  const [exporting, setExporting] = useState(false);

  const handleExport = async (format: 'excel' | 'csv' | 'pdf') => {
    try {
      setExporting(true);
      
      // Map component filters to API filters
      const apiFilters: ExportFilters = {
        per_page: 'all'
      };

      // Only add filters that have values
      if (filters.status && filters.status !== 'All') {
        apiFilters.status_filter = filters.status;
      }
      if (filters.campaignmid && filters.campaignmid !== 'All') {
        apiFilters.campaign_filter = filters.campaignmid;
      }
      if (filters.usermid && filters.usermid !== 'All') {
        apiFilters.user_filter = filters.usermid;
      }
      if (filters.tmid && filters.tmid !== 'All') {
        apiFilters.team_filter = filters.tmid;
      }
      if (filters.dateFrom && filters.dateTo) {
        apiFilters.date_from = filters.dateFrom;
        apiFilters.date_to = filters.dateTo;
      }

      // Call the appropriate export function
      switch (format) {
        case 'excel':
          await exportToExcel(apiFilters, 'lead-report');
          break;
        case 'csv':
          await exportToCSV(apiFilters, 'lead-report');
          break;
        case 'pdf':
          await exportToPDF(apiFilters, 'lead-report');
          break;
      }

      // Show success message
      message.success(`${format.toUpperCase()} export completed successfully!`);
      
    } catch (error) {
      console.error('Export error:', error);
      message.error(`Export failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setExporting(false);
    }
  };

  const exportItems = [
    {
      key: 'excel',
      label: 'Export to Excel',
      icon: <FileExcelOutlined />,
      onClick: () => handleExport('excel'),
    },
    {
      key: 'csv',
      label: 'Export to CSV',
      icon: <FileTextOutlined />,
      onClick: () => handleExport('csv'),
    },
    {
      key: 'pdf',
      label: 'Export to PDF',
      icon: <FilePdfOutlined />,
      onClick: () => handleExport('pdf'),
    },
  ];

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px' }}>
      <Title level={3} style={{ margin: 0 }}>All Lead Report</Title>
      <Space>
        <Button
          icon={<ReloadOutlined />}
          onClick={onRefresh}
          loading={isLoading}
        >
          Refresh
        </Button>

        <Dropdown
          menu={{ items: exportItems }}
          placement="bottomRight"
          disabled={leads.length === 0 || exporting}
          trigger={['click']}
        >
          <Button
            icon={<DownloadOutlined />}
            type="primary"
            loading={exporting}
          >
            Export {leads.length > 0 && `(${leads.length})`}
          </Button>
        </Dropdown>
      </Space>
    </div>
  );
};

export default LeadReportHeader;