import React, { useState, useEffect } from 'react'
import { Table, Checkbox, Badge } from 'antd'
import { Lead } from '../core/_models'
import { useThemeMode } from '../../../../../../_metronic/partials/layout/theme-mode/ThemeModeProvider'

interface LeadTableProps {
  leads: Lead[]
  loading?: boolean
  selectedLeads: number[]
  allSelected: boolean
  toggleLeadSelection: (leadId: number, checked: boolean) => void
  selectAllLeads: (checked: boolean) => void
}

const LeadTable: React.FC<LeadTableProps> = ({
  leads,
  loading = false,
  selectedLeads,
  allSelected,
  toggleLeadSelection,
  selectAllLeads
}) => {
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

  const skeletonRows: Lead[] = Array.from({ length: 10 }).map((_, i) => ({
    leadmid: i,
    cmpmid: 0,
    campaignmid: 0,
    sourceofinquirymid: 0,
    purposemid: 0,
    name: '',
    leadname: '',
    phone: '',
    email: '',
    detail: '',
    address: '',
    statusname: '',
    statuscolor: '',
    activityname: '',
    followup: 0,
    followupdate: null,
    iscalled: 0,
    leadremarks: '',
    statusmid: 0,
    usermid: 0,
    isclient: 0,
    extra_field1: '',
    extra_field2: '',
    extra_field3: '',
    created_at: '',
    updated_at: '',
    username: '',
    campaign: undefined,
    campaignname: '',
  }))

  const SkeletonCell = () => (
    <div className="placeholder-wave w-100">
      <span style={{ height: 20, display: 'block', borderRadius: 4 }} className="placeholder col-12" />
    </div>
  )

  const columns = [
    {
      title: <Checkbox checked={allSelected} onChange={(e) => selectAllLeads(e.target.checked)} />,
      dataIndex: 'select',
      key: 'select',
      width: 50,
      render: (_: any, record: Lead) =>
        showSkeleton ? <SkeletonCell /> : (
          <Checkbox
            checked={selectedLeads.includes(record.leadmid)}
            onChange={(e) => toggleLeadSelection(record.leadmid, e.target.checked)}
          />
        )
    },
    {
      title: 'Name',
      dataIndex: 'leadname',
      key: 'leadname',
      render: (_: string, record: Lead) => showSkeleton ? <SkeletonCell /> : record.leadname || record.name || 'Unnamed'
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
      render: (text: string) => showSkeleton ? <SkeletonCell /> : (text || '-')
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (text: string) => showSkeleton ? <SkeletonCell /> : (text || '-')
    },
    {
      title: 'Campaign',
      dataIndex: 'campaignname',
      key: 'campaign',
      render: (_: string, record: Lead) => showSkeleton ? <SkeletonCell /> : (record.campaign?.campaignname || record.campaignname || '-')
    },
    {
      title: 'Status',
      dataIndex: 'statusname',
      key: 'status',
      render: (_: string, record: Lead) =>
        showSkeleton ? <SkeletonCell /> : (
          <Badge
            color={record.statuscolor || undefined}
            text={record.statusname || 'Unknown'}
          />
        )
    },
    {
      title: 'Assigned To',
      dataIndex: 'username',
      key: 'assigned',
      render: (text: string) => showSkeleton ? <SkeletonCell /> : (text || 'Unassigned')
    },
    {
      title: 'Details',
      dataIndex: 'detail',
      key: 'detail',
      render: (text: string) => showSkeleton ? <SkeletonCell /> : (text || '-')
    }
  ]

  return (
    <Table<Lead>
      columns={columns}
      dataSource={showSkeleton ? skeletonRows : leads}
      rowKey="leadmid"
      loading={false} // disable AntD loader, using custom skeleton
      bordered
      size="middle"
      pagination={false}
      scroll={{ x: true }}
      style={{
        backgroundColor: isDark ? '#1a1a1a' : '#fff',
        color: isDark ? '#ccc' : '#333'
      }}
    />
  )
}

export default LeadTable
