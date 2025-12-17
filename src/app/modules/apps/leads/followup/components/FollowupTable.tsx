import React, { useState, useEffect, useMemo } from 'react'
import { Table } from 'antd'
import { FollowupLead } from '../core/_models'
import { useStatuses } from '../../allleads/core/LeadsContext'
import { StatusBadge } from './StatusBadge';
import { useThemeMode } from '../../../../../../_metronic/partials/layout/theme-mode/ThemeModeProvider'

interface FollowupTableProps {
  data: FollowupLead[]
  loading?: boolean
  onStatusClick?: (lead: FollowupLead) => void
  onCallClick?: (lead: FollowupLead) => void
  onViewClick?: (lead: FollowupLead) => void
  onEditClick?: (lead: FollowupLead) => void

  // Pagination / table controls
  currentPage?: number
  entriesPerPage?: number
  onEntriesPerPageChange?: (perPage: number) => void
  totalRecords?: number
  showingFrom?: number
  showingTo?: number

  // Search
  onSearch?: (searchTerm: string) => void
  searchTerm?: string
}




const FollowupTable: React.FC<FollowupTableProps> = ({
  data,
  loading = false,
  onStatusClick,
  onViewClick,
}) => {
  const { statuses } = useStatuses()
  const { mode } = useThemeMode()
  const isDark = mode === 'dark'

  const [showSkeleton, setShowSkeleton] = useState(false)

  useEffect(() => {
    if (loading) setShowSkeleton(true)
    else {
      const timeout = setTimeout(() => setShowSkeleton(false), 500)
      return () => clearTimeout(timeout)
    }
  }, [loading])

  // Skeleton data
  const skeletonRows: FollowupLead[] = Array.from({ length: 10 }).map((_, i) => ({
    leadmid: i,
    cmpmid: 0,
    campaignname: '',
    companymid: 0,
    sourceofinquiry: null,
    purpose: null,
    address: null,
    activity: null,
    detail: null,
    extra_field1: null,
    extra_field2: null,
    extra_field3: null,
    username: '',
    leadname: '',
    phone: '',
    email: '',
    statusname: '',
    followup: 0,
    followupdate: '',
    leadremarks: null,
    usermid: 0,
    iscalled: 0,
    calltype: null,
    starttime: null,
    endtime: null,
    callduration: null,
    created_at: '',
    followup_updatedate: '',
  }))

  // Skeleton cell
  const SkeletonCell = () => (
    <div className="placeholder-wave w-100">
      <span style={{ height: '20px', display: 'block', borderRadius: 4 }} className="placeholder col-12" />
    </div>
  )

  // Map statuses for colors
  const statusColorMap = useMemo(() => {
    const map = new Map()
    statuses.forEach((s) => map.set(s.statusname.toLowerCase(), s.statuscolor))
    return map
  }, [statuses])

  const getStatusColor = (status: string) => statusColorMap.get((status || '').toLowerCase()) || '#6c757d'

  // Columns
  const columns = [
    {
      title: '#',
      dataIndex: 'leadmid',
      key: 'sr',
      width: 60,
      align: 'center' as const,
      render: (_: FollowupLead, __: any, index: number) => (showSkeleton ? <SkeletonCell /> : index + 1),
    },
    {
      title: 'Lead Name',
      dataIndex: 'leadname',
      key: 'leadname',
      render: (text: string, record: FollowupLead) =>
        showSkeleton ? (
          <SkeletonCell />
        ) : (
          <span
            style={{ cursor: onViewClick ? 'pointer' : 'default', color: '#3f4254' }}
            onClick={() => onViewClick?.(record)}
          >
            {text || 'Unnamed Lead'}
          </span>
        ),
    },
    {
      title: 'Assigned To',
      dataIndex: 'username',
      key: 'assigned',
      render: (text: string) => (showSkeleton ? <SkeletonCell /> : text || 'Unassigned'),
    },
    {
      title: 'Campaign',
      dataIndex: 'campaignname',
      key: 'campaign',
      render: (text: string) => (showSkeleton ? <SkeletonCell /> : text || 'N/A'),
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
      render: (text: string, record: FollowupLead) =>
        showSkeleton ? (
          <SkeletonCell />
        ) : text ? (
          <a href={`tel:${text}`} onClick={(e) => e.stopPropagation()}>
            {text}
          </a>
        ) : (
          '-'
        ),
    },

    // Inside your columns definition
    {
      title: 'Status',
      className: 'text-center p-0',
      dataIndex: 'statusname',
      key: 'status',
      render: (text: string, record: FollowupLead) =>
        showSkeleton ? (
          <SkeletonCell />
        ) : (
          <StatusBadge
            text={text}
            getStatusColor={getStatusColor}
            onStatusClick={() => onStatusClick?.(record)}
          />
        ),
    },

    {
      title: 'Details',
      dataIndex: 'detail',
      key: 'details',
      render: (text: string) => (showSkeleton ? <SkeletonCell /> : text || '-'),
    },
    {
      title: 'Follow-up Date',
      dataIndex: 'followupdate',
      key: 'followupdate',
      render: (text: string) =>
        showSkeleton ? <SkeletonCell /> : text ? new Date(text).toLocaleDateString() : '-',
    },
  ]

  return (
    <Table
      columns={columns}
      dataSource={showSkeleton ? skeletonRows : data}
      rowKey="leadmid"
      loading={false} // disable AntD loader
      bordered
      size="middle"
      pagination={false}
      scroll={{ x: true }}
      style={{
        backgroundColor: isDark ? '#1a1a1a' : '#fff',
        color: isDark ? '#ccc' : '#333',
      }}
    />
  )
}

export default FollowupTable
