// src/app/modules/apps/reports/allleadreport/components/LeadReportTable/LeadReportTable.tsx
import React, { useState, useEffect } from 'react';
import { Table, Tag, Tooltip, Button, Space, Typography } from 'antd';
import { PhoneOutlined, EyeOutlined } from '@ant-design/icons';
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
  const [showSkeleton, setShowSkeleton] = useState(true); // Start with skeleton

  // Skeleton effect on loading or refresh
  useEffect(() => {
    if (loading || leads.length === 0) {
      setShowSkeleton(true);
    } else {
      const timeout = setTimeout(() => setShowSkeleton(false), 1000); // 1s delay
      return () => clearTimeout(timeout);
    }
  }, [loading, leads]);

  const showLeadDetails = (lead: LeadData) => {
    setSelectedLead(lead);
    setIsModalVisible(true);
  };

  // Skeleton cell
  const SkeletonCell = () => (
    <div className="placeholder-wave w-100">
      <span
        className="placeholder col-12"
        style={{ height: '20px', display: 'block', borderRadius: '4px' }}
      />
    </div>
  );

  // Skeleton rows
  const skeletonRows: LeadData[] = Array.from({ length: 10 }).map((_, index) => ({
    leadmid: index,
    campaignname: '',
    username: '',
    leadname: '',
    phone: '',
    purpose: '',
    detail: '',
    statusname: '',
    statuscolor: '#ccc',
    activity: '',
    leadremarks: '',
    updatedon: '',
    email: '',
    address: '',
    followup: 0,
    followupdate: null,
    iscalled: 0,
    created_at: '',
    addedon: ''
  }));

  const columns: ColumnsType<LeadData> = [
    {
      title: '#',
      key: 'index',
      width: 60,
      render: (_, __, index) => (showSkeleton ? <SkeletonCell /> : index + 1),
    },
    {
      title: 'Campaign',
      dataIndex: 'campaignname',
      key: 'campaignname',
      sorter: (a, b) => a.campaignname.localeCompare(b.campaignname),
      render: (text) => (showSkeleton ? <SkeletonCell /> : <Text>{text}</Text>),
    },
    {
      title: 'User',
      dataIndex: 'username',
      key: 'username',
      sorter: (a, b) => a.username.localeCompare(b.username),
      render: (text) => (showSkeleton ? <SkeletonCell /> : <Text>{text}</Text>),
    },
    {
      title: 'Name',
      dataIndex: 'leadname',
      key: 'leadname',
      sorter: (a, b) => a.leadname.localeCompare(b.leadname),
      render: (text) => (showSkeleton ? <SkeletonCell /> : <Text strong>{text}</Text>),
    },
    {
      title: 'Mobile',
      dataIndex: 'phone',
      key: 'phone',
      render: (text) => showSkeleton ? <SkeletonCell /> : (
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
      render: (text) => showSkeleton ? <SkeletonCell /> : text || '-',
    },
    {
      title: 'Detail',
      dataIndex: 'detail',
      key: 'detail',
      ellipsis: true,
      render: (text) => showSkeleton ? <SkeletonCell /> : (
        <Tooltip title={text}><span>{text}</span></Tooltip>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'statusname',
      key: 'statusname',
      render: (text, record) => showSkeleton ? <SkeletonCell /> : (
        <Tag color={record.statuscolor} style={{ color: '#fff' }}>{text}</Tag>
      ),
    },
    {
      title: 'Activity',
      dataIndex: 'activity',
      key: 'activity',
      render: (text) => showSkeleton ? <SkeletonCell /> : <Tag color="blue">{text}</Tag>,
    },
    {
      title: 'Remarks',
      dataIndex: 'leadremarks',
      key: 'leadremarks',
      render: (text) => showSkeleton ? <SkeletonCell /> : text || '-',
    },
    {
      title: 'Updated On',
      dataIndex: 'updatedon',
      key: 'updatedon',
      sorter: (a, b) => new Date(a.updatedon).getTime() - new Date(b.updatedon).getTime(),
      render: (text) => showSkeleton ? <SkeletonCell /> : <Text>{text}</Text>,
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 80,
      render: (_, record) => showSkeleton ? <SkeletonCell /> : (
        <Button type="text" icon={<EyeOutlined />} onClick={() => showLeadDetails(record)} />
      ),
    },
  ];

  return (
    <>
      <div style={{
        border: '1px solid #dee2e6',
        borderRadius: '4px',
        overflow: 'hidden',
      }}>
        <Table
          columns={columns}
          dataSource={showSkeleton ? skeletonRows : leads}
          rowKey="leadmid"
          pagination={false}
          scroll={{ x: 1500 }}
          size="middle"
          bordered
          onRow={(record) => ({
            onMouseEnter: (event) => { event.currentTarget.style.backgroundColor = '#f8f9fa'; },
            onMouseLeave: (event) => { event.currentTarget.style.backgroundColor = ''; },
          })}
          locale={{ emptyText: showSkeleton ? null : 'No data available' }} // hide default empty
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
