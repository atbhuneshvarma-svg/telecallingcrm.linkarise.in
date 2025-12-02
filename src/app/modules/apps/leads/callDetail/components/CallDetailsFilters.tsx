import React, { useState, useEffect, useRef } from 'react';
import { useLeads } from '../../allleads/core/LeadsContext';
import dayjs from 'dayjs';
import { format } from 'date-fns';
import {
  Card,
  Select,
  Button,
  DatePicker,
  Space,
  Tag,
  Row,
  Col,
  Input,
  Alert
} from 'antd';
import {
  CalendarOutlined,
  FilterOutlined,
  ReloadOutlined,
  CloseOutlined,
  UserOutlined,
  ProjectOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';

const { RangePicker } = DatePicker;
const { Option } = Select;

interface CallDetailsFiltersProps {
  entriesPerPage: number;
  onEntriesPerPageChange: (value: number) => void;
  filters: {
    user: string;
    campaign: string;
    status: string;
    startDate: string;
    endDate: string;
  };
  onFiltersChange: (filters: any) => void;
  onReset: () => void;
  loading?: boolean;
  totalRecords?: number;
}

const CallDetailsFilters: React.FC<CallDetailsFiltersProps> = ({
  entriesPerPage,
  onEntriesPerPageChange,
  filters,
  onFiltersChange,
  onReset,
  loading = false,
  totalRecords = 0,
}) => {
  const { dropdowns } = useLeads();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const datePickerRef = useRef<HTMLDivElement>(null);

  // Set default to current date on component mount
  useEffect(() => {
    if (!filters.startDate && !filters.endDate) {
      const today = new Date().toISOString().split('T')[0];
      onFiltersChange({
        ...filters,
        startDate: today,
        endDate: today
      });
    }
  }, []);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setShowDatePicker(false);
      }
    };

    if (showDatePicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDatePicker]);

  const handleEntriesChange = (value: number) => {
    onEntriesPerPageChange(value);
  };

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = {
      ...filters,
      [key]: value,
    };
    onFiltersChange(newFilters);
  };

  const handleDateRangeChange = (dates: any, dateStrings: [string, string]) => {
    if (dates) {
      onFiltersChange({
        ...filters,
        startDate: dateStrings[0],
        endDate: dateStrings[1]
      });
      setShowDatePicker(false);
    }
  };

  const handleQuickDateRange = (days: number) => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days);

    onFiltersChange({
      ...filters,
      startDate: format(startDate, 'yyyy-MM-dd'),
      endDate: format(endDate, 'yyyy-MM-dd')
    });
    setShowDatePicker(false);
  };

  const handleResetAll = () => {
    const today = new Date().toISOString().split('T')[0];
    onFiltersChange({
      user: 'All',
      campaign: 'All',
      status: 'All',
      startDate: today,
      endDate: today
    });
    onReset();
  };

  const clearDateFilter = () => {
    const today = new Date().toISOString().split('T')[0];
    onFiltersChange({
      ...filters,
      startDate: today,
      endDate: today
    });
  };

  // Get unique users from dropdowns
  const users = dropdowns?.users || [];
  const campaigns = dropdowns?.campaigns || [];
  const statuses = dropdowns?.statuses || [];

  // Check if any filters are active
  const today = new Date().toISOString().split('T')[0];
  const hasActiveFilters =
    filters.user !== 'All' ||
    filters.campaign !== 'All' ||
    filters.status !== 'All' ||
    filters.startDate !== today ||
    filters.endDate !== today;

  // Format date for display
  const formatDisplayDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  // Find display names for IDs
  const getUserDisplayName = (usermid: string) => {
    const user = users.find(u => u.usermid?.toString() === usermid);
    return user?.username || usermid;
  };

  const getCampaignDisplayName = (campaignId: string) => {
    const campaign = campaigns.find(c => c.id?.toString() === campaignId);
    return campaign?.name || campaignId;
  };

  const getStatusDisplayName = (statusId: string) => {
    const status = statuses.find(s => s.statusmid?.toString() === statusId);
    return status?.statusname || statusId;
  };

  const getDisplayDateRange = () => {
    if (filters.startDate === filters.endDate) {
      return formatDisplayDate(filters.startDate);
    }
    return `${formatDisplayDate(filters.startDate)} - ${formatDisplayDate(filters.endDate)}`;
  };

  return (
    <Card
      className="mb-6"
      size="small"
      title={
        <Space>
          <FilterOutlined />
          <span>Filters</span>
          {hasActiveFilters && (
            <Tag color="blue">
              {totalRecords} records filtered
            </Tag>
          )}
        </Space>
      }
      extra={
        hasActiveFilters ? (
          <Button
            size="small"
            icon={<CloseOutlined />}
            onClick={handleResetAll}
            disabled={loading}
          >
            Clear All
          </Button>
        ) : null
      }
    >
      <Row gutter={[16, 16]}>
        {/* Date Range Filter */}
        <Col xs={24} sm={12} md={6} ref={datePickerRef}>
          <div className="mb-2">
            <label className="ant-form-item-label">Date Range</label>
          </div>
          <Space.Compact style={{ width: '100%' }}>
            <Button
              icon={<CalendarOutlined />}
              onClick={() => setShowDatePicker(!showDatePicker)}
              style={{ width: '100%', textAlign: 'left' }}
            >
              {getDisplayDateRange()}
            </Button>
            {(filters.startDate !== today || filters.endDate !== today) && (
              <Button
                icon={<ReloadOutlined />}
                onClick={clearDateFilter}
                title="Reset to today"
              />
            )}
          </Space.Compact>

          {showDatePicker && (
            <Card
              size="small"
              style={{
                position: 'absolute',
                zIndex: 1000,
                marginTop: 8,
                width: 350
              }}
            >
              <RangePicker
                style={{ width: '100%' }}
                onChange={handleDateRangeChange}
                value={
                  filters.startDate && filters.endDate
                    ? [
                      filters.startDate ? dayjs(filters.startDate) : null,
                      filters.endDate ? dayjs(filters.endDate) : null
                    ]
                    : null
                }
                format="DD-MM-YYYY"
              />

              <div style={{ marginTop: 16 }}>
                <Space wrap>
                  <Button size="small" onClick={() => handleQuickDateRange(0)}>
                    Today
                  </Button>
                  <Button size="small" onClick={() => handleQuickDateRange(7)}>
                    Last 7 Days
                  </Button>
                  <Button size="small" onClick={() => handleQuickDateRange(30)}>
                    Last 30 Days
                  </Button>
                  <Button size="small" onClick={() => setShowDatePicker(false)}>
                    Apply
                  </Button>
                </Space>
              </div>
            </Card>
          )}
        </Col>

        {/* User Filter */}
        <Col xs={24} sm={12} md={4}>
          <div className="mb-2">
            <label className="ant-form-item-label">User</label>
          </div>
          <Select
            value={filters.user}
            onChange={(value) => handleFilterChange('user', value)}
            placeholder="All Users"
            style={{ width: '100%' }}
            suffixIcon={<UserOutlined />}
            loading={loading}
            allowClear
          >
            <Option value="All">All Users</Option>
            {users.map((user) => (
              <Option key={user.usermid} value={user.usermid?.toString()}>
                {user.username}
              </Option>
            ))}
          </Select>
        </Col>

        {/* Campaign Filter */}
        <Col xs={24} sm={12} md={4}>
          <div className="mb-2">
            <label className="ant-form-item-label">Campaign</label>
          </div>
          <Select
            value={filters.campaign}
            onChange={(value) => handleFilterChange('campaign', value)}
            placeholder="All Campaigns"
            style={{ width: '100%' }}
            suffixIcon={<ProjectOutlined />}
            loading={loading}
            allowClear
          >
            <Option value="All">All Campaigns</Option>
            {campaigns.map((campaign) => (
              <Option key={campaign.id} value={campaign.id?.toString()}>
                {campaign.name}
              </Option>
            ))}
          </Select>
        </Col>

        {/* Status Filter */}
        <Col xs={24} sm={12} md={4}>
          <div className="mb-2">
            <label className="ant-form-item-label">Status</label>
          </div>
          <Select
            value={filters.status}
            onChange={(value) => handleFilterChange('status', value)}
            placeholder="All Statuses"
            style={{ width: '100%' }}
            suffixIcon={<CheckCircleOutlined />}
            loading={loading}
            allowClear
          >
            <Option value="All">All Statuses</Option>
            {statuses.map((status) => (
              <Option key={status.statusmid} value={status.statusmid?.toString()}>
                {status.statusname}
              </Option>
            ))}
          </Select>
        </Col>

        {/* Entries per page */}
        <Col xs={24} sm={12} md={3}>
          <div className="mb-2">
            <label className="ant-form-item-label">Show</label>
          </div>
          <Select
            value={entriesPerPage}
            onChange={handleEntriesChange}
            style={{ width: '100%' }}
          >
            <Option value={10}>10 entries</Option>
            <Option value={25}>25 entries</Option>
            <Option value={50}>50 entries</Option>
            <Option value={100}>100 entries</Option>
          </Select>
        </Col>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <Col span={24}>
            <Alert
              message="Active Filters"
              description={
                <Space wrap>
                  {filters.user !== 'All' && (
                    <Tag color="blue">
                      <UserOutlined /> User: {getUserDisplayName(filters.user)}
                    </Tag>
                  )}
                  {filters.campaign !== 'All' && (
                    <Tag color="green">
                      <ProjectOutlined /> Campaign: {getCampaignDisplayName(filters.campaign)}
                    </Tag>
                  )}
                  {filters.status !== 'All' && (
                    <Tag color="orange">
                      <CheckCircleOutlined /> Status: {getStatusDisplayName(filters.status)}
                    </Tag>
                  )}
                  {(filters.startDate !== today || filters.endDate !== today) && (
                    <Tag color="purple">
                      <CalendarOutlined /> Date: {getDisplayDateRange()}
                    </Tag>
                  )}
                </Space>
              }
              type="info"
              showIcon
              closable
              onClose={handleResetAll}
            />
          </Col>
        )}
      </Row>
    </Card>
  );
};

export default CallDetailsFilters;