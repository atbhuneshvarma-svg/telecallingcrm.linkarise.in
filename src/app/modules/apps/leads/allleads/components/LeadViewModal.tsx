import React, { useMemo, useState } from 'react'
import { Modal, Spinner } from 'react-bootstrap'
import { Lead } from '../core/_models'
import { useStatuses } from '../core/LeadsContext'
import LeadModalHeader from './view/LeadModalHeader'
import LeadModalTabs from './view/LeadModalTabs'
import ModalFooter from './view/ModalFooter'

interface LeadViewModalProps {
  show: boolean
  lead: Lead | null
  onClose: () => void
  onEdit: (lead: Lead) => void
  onStatusUpdate?: (lead: Lead) => void
  loading?: boolean
}

const LeadViewModal: React.FC<LeadViewModalProps> = ({
  show,
  lead,
  onClose,
  onEdit,
  onStatusUpdate,
  loading = false
}) => {
  const { statuses } = useStatuses()
  const [activeTab, setActiveTab] = useState<string>('overview')

  const getStatusColor = (statusname: string) => {
    if (!statuses || statuses.length === 0) return '#6c757d'
    const status = statuses.find(
      (s) => s?.statusname?.toLowerCase() === (statusname || '').toLowerCase()
    )
    return status?.statuscolor || '#6c757d'
  }

  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return 'N/A'
    try {
      const date = new Date(dateString)
      return isNaN(date.getTime()) ? 'N/A' : date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return 'N/A'
    }
  }

  const handleTabSelect = (tab: string | null) => {
    if (tab) setActiveTab(tab)
  }

  if (!lead) return null

  return (
    <Modal show={show} onHide={onClose} size="xl" centered scrollable>
      <Modal.Header closeButton className="bg-light border-bottom-0">
        <Modal.Title className="h5 fw-bold d-flex align-items-center gap-2">
          <i className="bi bi-person-badge fs-4 text-primary"></i>
          Lead Details
          {loading && <Spinner animation="border" size="sm" className="ms-2" />}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="p-0">
        <LeadModalHeader 
          lead={lead}
          getStatusColor={getStatusColor}
          formatDate={formatDate}
          onStatusUpdate={onStatusUpdate}
          onEdit={onEdit}
          loading={loading}
        />

        <LeadModalTabs
          activeTab={activeTab}
          onTabSelect={handleTabSelect}
          lead={lead}
          getStatusColor={getStatusColor}
          formatDate={formatDate}
        />
      </Modal.Body>

      <ModalFooter
        onClose={onClose}
        onStatusUpdate={onStatusUpdate}
        onEdit={onEdit}
        lead={lead}
        loading={loading}
      />
    </Modal>
  )
}

export default LeadViewModal