// src/app/modules/apps/reports/allleadreport/components/LeadReportTable/LeadDetailModal.tsx
import React from 'react';
import { Modal, Descriptions, Tag, Space, Typography } from 'antd';
import { PhoneOutlined, MailOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { LeadData } from '../core/types';

const { Title, Text } = Typography;

interface LeadDetailModalProps {
  lead: LeadData | null;
  visible: boolean;
  onClose: () => void;
}

const LeadDetailModal: React.FC<LeadDetailModalProps> = ({ lead, visible, onClose }) => {
  if (!lead) return null;

  return (
    <Modal
      title={<Title level={4} style={{ margin: 0 }}>Lead Details</Title>}
      open={visible}
      onCancel={onClose}
      footer={null}
      width={600}
    >
      <Descriptions column={1} bordered size="small">
        <Descriptions.Item label="Name">
          <Text strong>{lead.leadname}</Text>
        </Descriptions.Item>
        
        <Descriptions.Item label="Contact">
          <Space direction="vertical">
            <Space>
              <PhoneOutlined />
              <Text >{lead.phone}</Text>
            </Space>
            <Space>
              <MailOutlined />
              <Text copyable strong >{lead.email}</Text>
            </Space>
          </Space>
        </Descriptions.Item>
        
        <Descriptions.Item label="Address">
          <Space>
            <EnvironmentOutlined />
            <Text>{lead.address}</Text>
          </Space>
        </Descriptions.Item>
        
        <Descriptions.Item label="Campaign">
          {lead.campaignname}
        </Descriptions.Item>
        
        <Descriptions.Item label="Assigned To">
          {lead.username}
        </Descriptions.Item>
        
        <Descriptions.Item label="Status">
          <Tag color={lead.statuscolor}>{lead.statusname}</Tag>
        </Descriptions.Item>
        
        <Descriptions.Item label="Purpose">
          {lead.purpose || '-'}
        </Descriptions.Item>
        
        <Descriptions.Item label="Details">
          {lead.detail}
        </Descriptions.Item>
        
        <Descriptions.Item label="Activity">
          <Tag>{lead.activity}</Tag>
        </Descriptions.Item>
        
        <Descriptions.Item label="Remarks">
          {lead.leadremarks || '-'}
        </Descriptions.Item>
        
        <Descriptions.Item label="Updated On">
          {lead.updatedon}
        </Descriptions.Item>
        
        {lead.followupdate && (
          <Descriptions.Item label="Follow-up Date">
            <Tag color="blue">{lead.followupdate}</Tag>
          </Descriptions.Item>
        )}
      </Descriptions>
    </Modal>
  );
};

export default LeadDetailModal;