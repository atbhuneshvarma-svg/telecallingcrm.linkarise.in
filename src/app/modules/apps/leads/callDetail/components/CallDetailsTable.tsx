import React, { useState, useEffect } from 'react'
import { Table } from 'antd'
import { CallDetail } from '../core/_models'
import { useThemeMode } from '../../../../../../_metronic/partials/layout/theme-mode/ThemeModeProvider'

interface CallDetailsTableProps {
  data: CallDetail[]
  loading?: boolean

  // Search
  showSearch?: boolean
  onSearch?: (searchTerm: string) => void
  searchTerm?: string

  // Pagination
  currentPage?: number
  entriesPerPage?: number
  onEntriesPerPageChange?: (value: number) => void
  showingFrom?: number
  showingTo?: number
  totalRecords?: number

  // Filters (if you actually use them)
  filters?: {
    [key: string]: any
  }
}


const CallDetailsTable: React.FC<CallDetailsTableProps> = ({ data, loading = false }) => {
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

  const skeletonRows: CallDetail[] = Array.from({ length: 10 }).map((_, i) => ({
    mobile: '',
    ldmid: i,
    cmpmid: 0,
    leadmid: 0,
    actvity: '',
    prospectname: '',
    sourceofinquiry: null,
    leademail: '',
    address: '',
    detail: '',
    extra_field1: null,
    extra_field2: null,
    extra_field3: null,
    purpose: null,
    telecaller_name: '',
    lead_name: '',
    primary_mobile: '',
    campaignname: '',
    statusname: '',
    statuscolor: '',
    followup: 0,
    followupremark: '',
    addedon: '',
    calltype: null,
    starttime: '',
    endtime: '',
    callduration: '',
    updatedon: '',
  }))

  const SkeletonCell = () => (
    <div className="placeholder-wave w-100">
      <span
        className="placeholder col-12"
        style={{ height: '20px', display: 'block', borderRadius: '4px' }}
      />
    </div>
  )

  const columns = [
    {
      title: '#',
      dataIndex: 'ldmid',
      key: 'sr',
      width: 60,
      align: 'center' as const,
      render: (_: CallDetail, __: any, index: number) => (showSkeleton ? <SkeletonCell /> : index + 1)

    },
    {
      title: 'Telecaller',
      dataIndex: 'telecaller_name',
      key: 'telecaller',
      render: (text: string) => (showSkeleton ? <SkeletonCell /> : text || '-'),
    },
    {
      title: 'Campaign',
      dataIndex: 'campaignname',
      key: 'campaign',
      render: (text: string) => (showSkeleton ? <SkeletonCell /> : text || '-'),
    },
    {
      title: 'Lead Name',
      dataIndex: 'lead_name',
      key: 'leadname',
      render: (text: string) => (showSkeleton ? <SkeletonCell /> : text || '-'),
    },
    {
      title: 'Mobile',
      dataIndex: 'primary_mobile',
      key: 'mobile',
      render: (text: string) => (showSkeleton ? <SkeletonCell /> : text || '-'),
    },
    {
      title: 'Start Time',
      dataIndex: 'starttime',
      key: 'starttime',
      render: (text: string) => (showSkeleton ? <SkeletonCell /> : text || '-'),
    },
    {
      title: 'End Time',
      dataIndex: 'endtime',
      key: 'endtime',
      render: (text: string) => (showSkeleton ? <SkeletonCell /> : text || '-'),
    },
    {
      title: 'Duration',
      dataIndex: 'callduration',
      key: 'duration',
      render: (text: string) => (showSkeleton ? <SkeletonCell /> : text || '-'),
    },
    {
      title: 'Call Type',
      dataIndex: 'calltype',
      key: 'calltype',
      render: (text: string) => (showSkeleton ? <SkeletonCell /> : text || '-'),
    },
    {
      title: 'Activity',
      dataIndex: 'actvity',
      key: 'activity',
      render: (text: string) => (showSkeleton ? <SkeletonCell /> : text || '-'),
    },
    {
      title: 'Status',
      dataIndex: 'statusname',
      key: 'status',
      render: (text: string) => (showSkeleton ? <SkeletonCell /> : text || '-'),
    },
    {
      title: 'Remarks',
      dataIndex: 'followupremark',
      key: 'remarks',
      render: (text: string) => (showSkeleton ? <SkeletonCell /> : text || '-'),
    },
  ]

  return (
    <Table
      columns={columns}
      dataSource={showSkeleton ? skeletonRows : data}
      rowKey="ldmid"
      loading={false} // disabled AntD built-in loader, we use custom skeleton
      bordered
      size="middle"
      scroll={{ x: true }}
      pagination={false} // disable built-in pagination
      style={{
        backgroundColor: isDark ? '#1a1a1a' : '#fff',
        color: isDark ? '#ccc' : '#333',
      }}
    />
  )

}

export default CallDetailsTable
