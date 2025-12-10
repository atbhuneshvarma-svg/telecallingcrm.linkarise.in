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

interface LeadReportHeaderProps {
  onRefresh: () => void;
  leads?: LeadData[];
  isLoading?: boolean;
}

const LeadReportHeader: React.FC<LeadReportHeaderProps> = ({
  onRefresh,
  leads = [],
  isLoading
}) => {
  const [exporting, setExporting] = useState(false);

  const handleExport = (type: 'excel' | 'csv' | 'pdf') => {
    if (!leads || leads.length === 0) {
      message.warning('No data to export');
      return;
    }

    setExporting(true);
    
    try {
      switch (type) {
        case 'excel':
          exportToExcel(leads, 'lead-report');
          message.success('Excel file downloaded successfully!');
          break;
        case 'csv':
          exportToCSV(leads, 'lead-report');
          message.success('CSV file downloaded successfully!');
          break;
        case 'pdf':
          exportToPDF(leads, 'lead-report');
          message.success('PDF generated successfully!');
          break;
      }
    } catch (error) {
      message.error('Failed to export data');
      console.error('Export error:', error);
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
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Title level={3} style={{ margin: 5, padding: 5 }}>All Lead Report</Title>
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
