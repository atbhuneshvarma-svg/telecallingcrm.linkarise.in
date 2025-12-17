// src/app/modules/apps/reports/allleadreport/components/LeadReportFilters/LeadReportFilters.tsx
import React from 'react';
import { 
  Row, 
  Col, 
  Select, 
  DatePicker, 
  Button, 
  Space,
  Card
} from 'antd';
import { FilterOutlined, SyncOutlined } from '@ant-design/icons';
import { FilterState, Campaign, User, Status, Team } from '../core/types';
import dayjs from 'dayjs';

const { Option } = Select;
const { RangePicker } = DatePicker;

interface LeadReportFiltersProps {
  filters: FilterState;
  onFilterChange: (filters: Partial<FilterState>) => void;
  campaigns: Campaign[];
  users: User[];
  statuses: Status[];
  teams: Team[];
}

const LeadReportFilters: React.FC<LeadReportFiltersProps> = ({
  filters,
  onFilterChange,
  campaigns,
  users,
  statuses,
  teams
}) => {
  const handleDateChange = (dates: any) => {
    if (dates) {
      onFilterChange({
        dateFrom: dates[0].format('YYYY-MM-DD'),
        dateTo: dates[1].format('YYYY-MM-DD'),
      });
    } else {
      onFilterChange({
        dateFrom: '',
        dateTo: '',
      });
    }
  };

  const handleSelectChange = (field: keyof FilterState) => (value: string) => {
    let apiValue = '';
    
    if (value && value !== 'All' && value !== '') {
      switch (field) {
        case 'campaignmid':
          const campaign = campaigns.find(c => c.campaignname === value);
          apiValue = campaign?.campaignmid?.toString() || '';
          break;
        case 'tmid':
          const team = teams.find(t => t.teamname === value);
          apiValue = team?.tmid?.toString() || '';
          break;
        case 'usermid':
          const user = users.find(u => u.username === value);
          apiValue = user?.usermid?.toString() || '';
          break;
        case 'status':
          apiValue = value;
          break;
        default:
          apiValue = value;
      }
    }
    
    onFilterChange({ [field]: apiValue });
  };

  const handleReset = () => {
    onFilterChange({
      campaignmid: '',
      status: '',
      usermid: '',
      tmid: '',
      dateFrom: '',
      dateTo: '',
      page: 1,
    });
  };

  // Helper function to get display value from ID
  const getDisplayValue = (field: keyof FilterState, idValue: string | undefined): string => {
    if (!idValue || idValue === '') {
      return field === 'campaignmid' ? '' : '';
    }
    
    switch (field) {
      case 'campaignmid':
        const campaign = campaigns.find(c => c.campaignmid?.toString() === idValue);
        return campaign?.campaignname || '';
      case 'tmid':
        const team = teams.find(t => t.tmid?.toString() === idValue);
        return team?.teamname || '';
      case 'usermid':
        const user = users.find(u => u.usermid?.toString() === idValue);
        return user?.username || '';
      case 'status':
        return idValue;
      default:
        return idValue;
    }
  };

  const applyFilters = () => {
    console.log('Applying filters:', filters);
  };

  return (
    <Card size="small" style={{ marginBottom: 16 }}>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Select
            value={getDisplayValue('campaignmid', filters.campaignmid)}
            onChange={handleSelectChange('campaignmid')}
            placeholder="All Campaigns"
            style={{ width: '100%' }}
          >
            <Option value="">All Campaigns</Option>
            {campaigns.map(campaign => (
              <Option key={campaign.campaignmid} value={campaign.campaignname}>
                {campaign.campaignname}
              </Option>
            ))}
          </Select>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Select
            value={getDisplayValue('status', filters.status)}
            onChange={handleSelectChange('status')}
            placeholder="All Status"
            style={{ width: '100%' }}
          >
            <Option value="">All Status</Option>
            {statuses.map(status => (
              <Option key={status.statusmid} value={status.statusname}>
                <Space>
                  <div
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      backgroundColor: status.statuscolor,
                    }}
                  />
                  {status.statusname}
                </Space>
              </Option>
            ))}
          </Select>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Select
            value={getDisplayValue('usermid', filters.usermid)}
            onChange={handleSelectChange('usermid')}
            placeholder="All Users"
            style={{ width: '100%' }}
          >
            <Option value="">All Users</Option>
            {users.map(user => (
              <Option key={user.usermid} value={user.username}>
                {user.username}
              </Option>
            ))}
          </Select>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Select
            value={getDisplayValue('tmid', filters.tmid)}
            onChange={handleSelectChange('tmid')}
            placeholder="All Teams"
            style={{ width: '100%' }}
          >
            <Option value="">All Teams</Option>
            {teams.map(team => (
              <Option key={team.tmid} value={team.teamname}>
                {team.teamname}
              </Option>
            ))}
          </Select>
        </Col>

        <Col xs={24} sm={12} md={8}>
          <RangePicker
            style={{ width: '100%' }}
            onChange={handleDateChange}
            value={
              filters.dateFrom && filters.dateTo
                ? [dayjs(filters.dateFrom || ''), dayjs(filters.dateTo || '')]
                : null
            }
          />
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
            <Button
              type="primary"
              icon={<FilterOutlined />}
              onClick={applyFilters}
            >
              Filter
            </Button>
            <Button
              icon={<SyncOutlined />}
              onClick={handleReset}
            >
              Reset
            </Button>
          </Space>
        </Col>
      </Row>
    </Card>
  );
};

export default LeadReportFilters;