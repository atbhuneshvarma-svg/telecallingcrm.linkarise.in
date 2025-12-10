import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { Popover } from 'antd';
import {
  Card,
  Select,
  Button,
  DatePicker,
  Input,
  Space,
  Row,
  Col
} from 'antd';
import {
  CalendarOutlined,
  FilterOutlined,
  SearchOutlined,
  ReloadOutlined,
  UserOutlined
} from '@ant-design/icons';
import { TelecallerPerformanceFilters as TelecallerPerformanceFiltersType, Telecaller } from '../core/_models';
import { useLeads } from '../../../leads/allleads/core/LeadsContext';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { Search } = Input;

interface TelecallerPerformanceFiltersProps {
  filters: TelecallerPerformanceFiltersType;
  telecallers: Telecaller[];
  onFiltersChange: (filters: Partial<TelecallerPerformanceFiltersType>) => void;
  onReset: () => void;
  onRefresh: () => void;
  totalTelecallers: number;
  isLoading: boolean;
}

export const TelecallerPerformanceFilters: React.FC<TelecallerPerformanceFiltersProps> = ({
  filters,
  telecallers,
  onFiltersChange,
  onReset,
  onRefresh,
  isLoading
}) => {
  const { dropdowns } = useLeads();
  const useroptions = dropdowns.users || [];
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Set default current date if no date is selected
  useEffect(() => {
    if (!filters.date_from && !filters.date_to) {
      const currentDate = dayjs().format('YYYY-MM-DD');
      onFiltersChange({
        date_from: currentDate,
        date_to: currentDate
      });
    }
  }, [filters.date_from, filters.date_to, onFiltersChange]);

  const handleDateRangeChange = (dates: any, dateStrings: [string, string]) => {
    if (dates) {
      onFiltersChange({
        date_from: dateStrings[0],
        date_to: dateStrings[1]
      });
      setShowDatePicker(false);
    }
  };

  const handleQuickDateRange = (days: number) => {
    const endDate = dayjs();
    const startDate = dayjs().subtract(days, 'day');

    onFiltersChange({
      date_from: startDate.format('YYYY-MM-DD'),
      date_to: endDate.format('YYYY-MM-DD')
    });
  };

  const clearDateFilter = () => {
    const today = dayjs().format('YYYY-MM-DD');
    onFiltersChange({
      date_from: today,
      date_to: today
    });
  };

  const getDisplayDateRange = () => {
    if (!filters.date_from || !filters.date_to) return 'Select Date Range';

    if (filters.date_from === filters.date_to) {
      return dayjs(filters.date_from).format('MMM DD, YYYY');
    }
    return `${dayjs(filters.date_from).format('MMM DD, YYYY')} - ${dayjs(filters.date_to).format('MMM DD, YYYY')}`;
  };

  const isDefaultDate = () => {
    const today = dayjs().format('YYYY-MM-DD');
    return filters.date_from === today && filters.date_to === today;
  };

  const hasActiveFilters =
    !isDefaultDate() ||
    (filters.usermid !== undefined && filters.usermid !== null) ||
    (filters.telecaller_id !== undefined && filters.telecaller_id !== null) ||
    (filters.search && filters.search.trim() !== '');

  const dateRangeContent = (
    <div style={{ width: 260, padding: 8 }}>
      <RangePicker
        size="small"
        style={{ width: '100%', fontSize: '12px' }}
        onChange={handleDateRangeChange}
        value={
          filters.date_from && filters.date_to
            ? [
              filters.date_from ? dayjs(filters.date_from) : null,
              filters.date_to ? dayjs(filters.date_to) : null
            ]
            : null
        }
        format="DD-MM-YYYY"
        popupStyle={{ fontSize: '12px' }}
        suffixIcon={<CalendarOutlined style={{ fontSize: '12px' }} />}
      />

      <div style={{ marginTop: 12 }}>
        <Space wrap size={[4, 4]}>
          <Button
            size="small"
            onClick={() => handleQuickDateRange(0)}
          >
            Today
          </Button>
          <Button
            size="small"
            onClick={() => handleQuickDateRange(7)}
          >
            7 Days
          </Button>
          <Button
            size="small"
            onClick={() => handleQuickDateRange(30)}
          >
            30 Days
          </Button>
          <Button
            size="small"
            type="primary"
            onClick={() => setShowDatePicker(false)}
          >
            Apply
          </Button>
        </Space>
      </div>
    </div>
  );

  return (
    <Card
      title={
        <Space>
          <FilterOutlined />
          <span>Performance Report Filters</span>
          {hasActiveFilters && (
            <Button
              type="link"
              size="small"
              onClick={onReset}
              icon={<ReloadOutlined />}
            >
              Clear Filters
            </Button>
          )}
        </Space>
      }
      extra={
        <Space>
          <Button
            icon={<ReloadOutlined />}
            onClick={onReset}
            disabled={isLoading}
          >
            Reset
          </Button>
          <Button
            type="primary"
            icon={<FilterOutlined />}
            onClick={onRefresh}
            loading={isLoading}
          >
            Refresh
          </Button>
        </Space>
      }
      style={{ marginBottom: 16 }}
    >
      <Row gutter={[16, 16]}>
        {/* Date Range Filter */}
        <Col xs={24} md={8}>
          <div style={{ marginBottom: 8 }}>
            <strong>Date Range</strong>
          </div>
          <Space.Compact style={{ width: '100%' }}>
            <Popover
              content={dateRangeContent}
              title="Select Date Range"
              trigger="click"
              open={showDatePicker}
              onOpenChange={setShowDatePicker}
              placement="bottomLeft"
            >
              <Button
                icon={<CalendarOutlined />}
                style={{ width: '100%', textAlign: 'left' }}
              >
                {getDisplayDateRange()}
              </Button>
            </Popover>
            {!isDefaultDate() && (
              <Button
                icon={<ReloadOutlined />}
                onClick={clearDateFilter}
                title="Reset to today"
              />
            )}
          </Space.Compact>
        </Col>

        {/* User Filter */}
        <Col xs={24} md={8}>
          <div style={{ marginBottom: 8 }}>
            <strong>User</strong>
          </div>
          <Select
            value={filters.usermid || filters.telecaller_id || undefined}
            onChange={(value) => onFiltersChange({
              usermid: value ? Number(value) : undefined,
              telecaller_id: value ? Number(value) : undefined
            })}
            placeholder="All Users"
            style={{ width: '100%' }}
            suffixIcon={<UserOutlined />}
            loading={isLoading}
            allowClear
          >
            <Option value="">All Users</Option>
            {useroptions.map((telecaller) => (
              <Option key={telecaller.usermid} value={telecaller.usermid}>
                {telecaller.username}
              </Option>
            ))}
          </Select>
        </Col>

        {/* Search Filter */}
        <Col xs={24} md={8}>
          <div style={{ marginBottom: 8 }}>
            <strong>Search</strong>
          </div>
          <Search
            placeholder="Search telecallers..."
            value={filters.search || ''}
            onChange={(e) => onFiltersChange({ search: e.target.value })}
            onSearch={(value) => onFiltersChange({ search: value })}
            allowClear
            enterButton={<SearchOutlined />}
            loading={isLoading}
          />
        </Col>
      </Row>

      {/* Active Filters Indicator */}
      {hasActiveFilters && (
        <div style={{ marginTop: 16, padding: 8, backgroundColor: '#f0f9ff', borderRadius: 4 }}>
          <Space wrap>
            <span style={{ fontWeight: 500 }}>Active Filters:</span>

            {!isDefaultDate() && (
              <Button size="small" type="text">
                <CalendarOutlined /> Date: {getDisplayDateRange()}
              </Button>
            )}

            {(filters.usermid || filters.telecaller_id) && (
              <Button size="small" type="text">
                <UserOutlined /> User: {
                  useroptions.find(u => u.usermid === (filters.usermid || filters.telecaller_id))?.username
                }
              </Button>
            )}

            {filters.search && filters.search.trim() !== '' && (
              <Button size="small" type="text">
                <SearchOutlined /> Search: "{filters.search}"
              </Button>
            )}
          </Space>
        </div>
      )}
    </Card>
  );
};