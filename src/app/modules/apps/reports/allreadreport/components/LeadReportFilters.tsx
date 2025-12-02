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
    onFilterChange({ [field]: value });
  };

  const handleReset = () => {
    onFilterChange({
      campaign: 'All',
      status: '',
      user: '',
      team: '',
      dateFrom: '',
      dateTo: '',
      page: 1,
    });
  };

  return (
    <Card size="small" style={{ marginBottom: 16 }}>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Select
            value={filters.campaign}
            onChange={handleSelectChange('campaign')}
            placeholder="All Campaigns"
            style={{ width: '100%' }}
          >
            <Option value="All">All Campaigns</Option>
            {campaigns.map(campaign => (
              <Option key={campaign.campaignmid} value={campaign.campaignname}>
                {campaign.campaignname}
              </Option>
            ))}
          </Select>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Select
            value={filters.status}
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
            value={filters.user}
            onChange={handleSelectChange('user')}
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
            value={filters.team}
            onChange={handleSelectChange('team')}
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
                ? [dayjs(filters.dateFrom), dayjs(filters.dateTo)]
                : null
            }
          />
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
            <Button
              type="primary"
              icon={<FilterOutlined />}
              onClick={() => onFilterChange({})}
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