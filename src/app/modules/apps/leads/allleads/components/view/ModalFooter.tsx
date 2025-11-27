import React from 'react'
import { Button , Modal} from 'react-bootstrap'
import { Lead } from '../../core/_models'

interface ModalFooterProps {
  onClose: () => void
  onStatusUpdate?: (lead: Lead) => void
  onEdit: (lead: Lead) => void
  lead: Lead
  loading: boolean
}

const ModalFooter: React.FC<ModalFooterProps> = ({
  onClose,
  onStatusUpdate,
  onEdit,
  lead,
  loading
}) => {
  return (
    <Modal.Footer className="bg-light border-top-0">
      <Button variant="outline-secondary" onClick={onClose} disabled={loading}>
        <i className="bi bi-x-circle me-2"></i>
        Close
      </Button>
      <Button 
        variant="outline-primary"
        onClick={() => onStatusUpdate?.(lead)}
        disabled={loading}
      >
        <i className="bi bi-arrow-repeat me-2"></i>
        Update Status
      </Button>
      <Button 
        variant="primary"
        onClick={() => {
          onEdit(lead)
          onClose()
        }}
        disabled={loading}
      >
        <i className="bi bi-pencil me-2"></i>
        Edit Lead
      </Button>
    </Modal.Footer>
  )
}

export default ModalFooter