// WhatsAppTemplateModal.tsx
import React from 'react'
import { Modal } from 'react-bootstrap'
import { WhatsAppTemplate } from './core/_models'

interface WhatsAppTemplateModalProps {
  show: boolean
  onClose: () => void
  mode: 'add' | 'edit'
  template: WhatsAppTemplate
  setTemplate: (template: WhatsAppTemplate) => void
  onSubmit: () => void
}

const WhatsAppTemplateModal: React.FC<WhatsAppTemplateModalProps> = ({
  show,
  onClose,
  mode,
  template,
  setTemplate,
  onSubmit
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setTemplate({
      ...template,
      [name]: value
    })
  }

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="fw-bold fs-3">
          {mode === 'add' ? 'Add Whatsapp Template' : 'Edit Whatsapp Template'}
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body className="pt-0">
        <div className="row g-4">
          {/* Template Name */}
          <div className="col-12">
            <label htmlFor="name" className="form-label fw-semibold">
              Template Name *
            </label>
            <input
              type="text"
              className="form-control form-control-solid"
              id="name"
              name="name"
              value={template.name}
              onChange={handleInputChange}
              placeholder="Enter template name"
            />
          </div>

          {/* Message */}
          <div className="col-12">
            <label htmlFor="body" className="form-label fw-semibold">
              Message *
            </label>
            <textarea
              className="form-control form-control-solid"
              id="body"
              name="body"
              value={template.body}
              onChange={handleInputChange}
              placeholder="Enter your message content"
              rows={6}
            />
          </div>
        </div>
      </Modal.Body>

      <Modal.Footer className="border-0 pt-0">
        <div className="d-flex gap-3 w-100">
          <button 
            type="button" 
            className="btn btn-lg btn-primary flex-grow-1"
            onClick={onSubmit}
          >
            Submit
          </button>
          <button 
            type="button" 
            className="btn btn-lg btn-light flex-grow-1"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
        
        {/* Footer Copyright */}
        <div className="w-100 text-center mt-4 pt-3 border-top">
          <span className="text-muted">2025 © Arth Technology</span>
        </div>
      </Modal.Footer>
    </Modal>
  )
}

export default WhatsAppTemplateModal