// src/app/modules/apps/reports/allleadreport/components/LeadReportTable/LeadReportTable.tsx
import React, { useState } from 'react';
import { Table, Tag, Tooltip, Button, Space, Typography, Badge } from 'antd';
import { PhoneOutlined, MailOutlined, EyeOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { LeadData } from '../core/types';
import LeadDetailModal from './LeadDetailModal';

const { Text } = Typography;

interface LeadReportTableProps {
  leads: LeadData[];
  loading?: boolean;
}

const LeadReportTable: React.FC<LeadReportTableProps> = ({ leads, loading }) => {
  const [selectedLead, setSelectedLead] = useState<LeadData | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showLeadDetails = (lead: LeadData) => {
    setSelectedLead(lead);
    setIsModalVisible(true);
  };

  const columns: ColumnsType<LeadData> = [
    {
      title: '#',
      key: 'index',
      width: 60,
      render: (_, __, index) => index + 1,
    },
    {
      title: 'Campaign',
      dataIndex: 'campaignname',
      key: 'campaignname',
      sorter: (a, b) => a.campaignname.localeCompare(b.campaignname),
    },
    {
      title: 'User',
      dataIndex: 'username',
      key: 'username',
      sorter: (a, b) => a.username.localeCompare(b.username),
    },
    {
      title: 'Name',
      dataIndex: 'leadname',
      key: 'leadname',
      sorter: (a, b) => a.leadname.localeCompare(b.leadname),
      render: (text) => (
        <Space>
          <Text strong>{text}</Text>
        </Space>
      ),
    },
    {
      title: 'Mobile',
      dataIndex: 'phone',
      key: 'phone',
      render: (text) => (
        <Space>
          <PhoneOutlined style={{ color: '#1890ff' }} />
          <Text copyable>{text}</Text>
        </Space>
      ),
    },
    {
      title: 'Purpose',
      dataIndex: 'purpose',
      key: 'purpose',
      render: (text) => text || '-',
    },
    {
      title: 'Detail',
      dataIndex: 'detail',
      key: 'detail',
      ellipsis: true,
      render: (text) => (
        <Tooltip title={text}>
          <span>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'statusname',
      key: 'statusname',
      render: (text, record) => (
        <Tag color={record.statuscolor} style={{ color: '#fff'}}>
          {text}
        </Tag>
      ),
    },
    {
      title: 'Activity',
      dataIndex: 'activity',
      key: 'activity',
      render: (text) => (
        <Tag color="blue">{text}</Tag>
      ),
    },
    {
      title: 'Remarks',
      dataIndex: 'leadremarks',
      key: 'leadremarks',
      render: (text) => text || '-',
    },
    {
      title: 'Updated On',
      dataIndex: 'updatedon',
      key: 'updatedon',
      sorter: (a, b) => new Date(a.updatedon).getTime() - new Date(b.updatedon).getTime(),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 80,
      render: (_, record) => (
        <Button
          type="text"
          icon={<EyeOutlined />}
          onClick={() => showLeadDetails(record)}
        />
      ),
    },
  ];

  return (
    <>
      <div style={{ 
        border: '1px solid #dee2e6',
        borderRadius: '4px',
        overflow: 'hidden',
        alignItems:'center',
        justifyContent:"center"
      }}>
        <Table
          columns={columns}
          dataSource={leads}
          rowKey="leadmid"
          loading={loading}
          pagination={false}
          scroll={{ x: 1500 }}
          size="middle"
          bordered
          // Bootstrap-like styles
          style={{
            fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          }}
          // Add hover effect
          onRow={(record) => ({
            onMouseEnter: (event) => {
              event.currentTarget.style.backgroundColor = '#f8f9fa';
            },
            onMouseLeave: (event) => {
              event.currentTarget.style.backgroundColor = '';
            },
          })}
          // Custom CSS classes
          className="ant-table-bordered ant-table-hover"
        />
      </div>

      <LeadDetailModal
        lead={selectedLead}
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
      />
    </>
  );
};

export default LeadReportTable;