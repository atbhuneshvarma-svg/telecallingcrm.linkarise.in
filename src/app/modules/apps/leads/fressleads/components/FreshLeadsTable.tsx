// components/FreshLeadsTable.tsx
import React, { useState, useEffect, useMemo } from 'react'
import { Table, Input, Select } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { StatusBadge } from '../../followup/components/StatusBadge'
import LeadStatusUpdateModal from './../../allleads/components/LeadStatusUpdateModal'
import { FreshLead } from '../core/_models'
import { useToast } from '../../allleads/hooks/useToast'
import { toast } from 'react-toastify'

const { Search } = Input
const { Option } = Select




interface FreshLeadsTableProps {
  leads: FreshLead[]
  isLoading: boolean
  currentPage: number
  perPage: number
  onViewClick?: (lead: FreshLead) => void
  onEditClick?: (lead: FreshLead) => void
  onStatusClick?: (lead: FreshLead) => void
  onSearch?: (searchTerm: string) => void
  searchTerm?: string
  totalRecords?: number
  onEntriesPerPageChange?: (perPage: number) => void
  onStatusUpdate?: (leadId: number, newStatus: string, notes?: string) => Promise<void>
  availableStatuses?: Array<{ value: string; label: string; color?: string }>
}

export const FreshLeadsTable: React.FC<FreshLeadsTableProps> = ({
  leads,
  isLoading,
  currentPage,
  perPage,
  onViewClick,
  onStatusClick,
  onSearch,
  searchTerm = '',
  onEntriesPerPageChange,
  onStatusUpdate,
}) => {
  const [localSearch, setLocalSearch] = useState(searchTerm)
  const [statusModalOpen, setStatusModalOpen] = useState(false)
  const [selectedLead, setSelectedLead] = useState<FreshLead | null>(null)
  const [updatingStatus, setUpdatingStatus] = useState(false)

  // Skeleton row definition
  const skeletonRows: FreshLead[] = Array.from({ length: perPage }).map((_, i) => ({
    leadmid: i,
    cmpmid: 0,
    campaignmid: null,
    leadname: '',
    phone: '',
    email: '',
    gender: null,
    dob: null,
    marital_status: null,
    detail: null,
    address: null,
    city: null,
    state: null,
    occupation: null,
    annual_income: null,
    pan_number: null,
    aadhaar_number: null,
    kyc_status: null,
    statusname: '',
    statuscolor: '',
    activity: '',
    followup: 0,
    followupdate: null,
    iscalled: 0,
    leadremarks: null,
    usermid: 0,
    extra_field1: null,
    extra_field2: null,
    extra_field3: null,
    createdat: '',
    updatedat: '',
    campaignname: null,
    username: '',
    sourceofinquiry: '',
    purpose: '',
  }))

  const SkeletonCell = () => (
    <div className="placeholder-wave w-100">
      <span style={{ height: 20, display: 'block', borderRadius: 4 }} className="placeholder col-12" />
    </div>
  )

  // Handle Status Click
  const handleStatusClick = (lead: FreshLead) => {
    if (onStatusClick) {
      onStatusClick(lead)
    } else {
      setSelectedLead(lead)
      setStatusModalOpen(true)
    }
  }

  const handleStatusModalClose = () => {
    setStatusModalOpen(false)
    setSelectedLead(null)
  }

  const { showSuccess } = useToast()
const handleStatusUpdate = async (newStatus: string, notes?: string) => {
  if (!selectedLead || !onStatusUpdate) return;
  setUpdatingStatus(true);
  try {
    await onStatusUpdate(selectedLead.leadmid, newStatus, notes);

    // Show toast using react-toastify
    toast.success(`Status updated to "${newStatus}" for ${selectedLead.leadname}`, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });

    // Close modal
    handleStatusModalClose();

    // Optionally refresh leads
    onSearch?.('');
  } catch (err) {
    console.error(err);
  } finally {
    setUpdatingStatus(false);
  }
};




  // Columns
  const columns: ColumnsType<FreshLead> = [
    {
      title: '#',
      key: 'index',
      width: 60,
      render: (_text, _record, index) => (isLoading ? <SkeletonCell /> : (currentPage - 1) * perPage + index + 1),
    },
    {
      title: 'Lead Info',
      dataIndex: 'leadname',
      key: 'leadname',
      render: (text, record) => isLoading ? <SkeletonCell /> : (
        <span
          style={{ cursor: onViewClick ? 'pointer' : 'default' }}
          onClick={() => onViewClick?.(record)}
        >
          {text || 'Unnamed Lead'}
        </span>
      ),
    },
    {
      title: 'Contact',
      dataIndex: 'phone',
      key: 'phone',
      render: (text, record) => isLoading ? <SkeletonCell /> : text ? (
        <a href={`tel:${text}`} onClick={e => e.stopPropagation()}>{text}</a>
      ) : 'No contact',
    },
    {
      title: 'Campaign',
      dataIndex: 'campaignname',
      key: 'campaignname',
      render: text => isLoading ? <SkeletonCell /> : text || 'N/A',
    },
    {
      title: 'Source',
      dataIndex: 'sourceofinquiry',
      key: 'sourceofinquiry',
      render: text => isLoading ? <SkeletonCell /> : text || '-',
    },
    {
      title: 'Purpose',
      dataIndex: 'purpose',
      key: 'purpose',
      render: text => isLoading ? <SkeletonCell /> : text || '-',
    },
    {
      title: 'Status',
      dataIndex: 'statusname',
      className: 'p-0',
      width: '110px',
      key: 'statusname',
      align: 'center',
      render: (text, record) => isLoading ? <SkeletonCell /> : (
        <StatusBadge
          text={text || 'N/A'}
          getStatusColor={(status) => record.statuscolor || '#6c757d'}
          onStatusClick={() => handleStatusClick(record)}
        />
      ),
    },
    {
      title: 'Assigned',
      dataIndex: 'username',
      key: 'username',
      render: text => isLoading ? <SkeletonCell /> : text || 'Unassigned',
    },
    {
      title: 'Created',
      dataIndex: 'createdat',
      key: 'createdat',
      render: text => {
        if (isLoading) return <SkeletonCell />
        if (!text) return '-'
        const d = new Date(text)
        const options: Intl.DateTimeFormatOptions = {
          month: 'short',
          day: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        }
        return d.toLocaleString('en-US', options)
      },
    },
  ]

  return (
    <>
      {/* Top Controls */}
      <div className="d-flex justify-content-between mb-3">
        <Select
          value={perPage}
          onChange={onEntriesPerPageChange}
          style={{ width: 80 }}
          disabled={isLoading}
        >
          <Option value={10}>10</Option>
          <Option value={25}>25</Option>
          <Option value={50}>50</Option>
          <Option value={100}>100</Option>
        </Select>

        <Search
          placeholder="Search leads..."
          value={localSearch}
          onChange={e => {
            setLocalSearch(e.target.value)
            onSearch?.(e.target.value)
          }}
          allowClear
          style={{ width: 250 }}
        />
      </div>

      <Table
        rowKey="leadmid"
        columns={columns}
        dataSource={isLoading ? skeletonRows : leads}
        bordered
        pagination={false}
      />

      {selectedLead && (
        <LeadStatusUpdateModal
          show={statusModalOpen}
          onHide={handleStatusModalClose}
          lead={selectedLead}
          onStatusUpdated={() => {
            // Use the updated status
            if (selectedLead) {
              handleStatusUpdate(selectedLead.statusname)
            }
          }}
        />
      )}
    </>
  )
}

export default FreshLeadsTable
