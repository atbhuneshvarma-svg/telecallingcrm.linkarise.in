// WhatsAppTemplateModal.tsx
import React, { useState, useRef } from 'react'
import { Modal } from 'react-bootstrap'
import { WhatsAppTemplate } from './core/_models'

interface WhatsAppTemplateModalProps {
  show: boolean
  onClose: () => void
  mode: 'add' | 'edit'
  template: WhatsAppTemplate
  setTemplate: (template: WhatsAppTemplate) => void
  onSubmit: () => void
  onImageUpload: (file: File) => void
  onClearImage: () => void
  selectedImage: File | null
  imagePreview?: string | null
}

const WhatsAppTemplateModal: React.FC<WhatsAppTemplateModalProps> = ({
  show,
  onClose,
  mode,
  template,
  setTemplate,
  onSubmit,
  onImageUpload,
  onClearImage,
  selectedImage,
  imagePreview
}) => {
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setTemplate({
      ...template,
      [name]: value
    })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size should be less than 5MB')
        return
      }
      
      // Check file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']
      if (!validTypes.includes(file.type)) {
        alert('Only JPEG, PNG, and GIF images are allowed')
        return
      }
      
      onImageUpload(file)
    }
  }

  const handleSubmit = () => {
    // Basic validation
    if (!template.template_name?.trim()) {
      alert('Template Name is required')
      return
    }
    
    if (!template.message?.trim()) {
      alert('Message is required')
      return
    }
    
    if (template.type === 'ImageText' && !selectedImage && !template.image_url && mode === 'add') {
      alert('Please upload an image for ImageText template')
      return
    }
    
    onSubmit()
  }

  return (
    <Modal show={show} onHide={onClose} centered size="lg">
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="fw-bold fs-3">
          {mode === 'add' ? 'Add Whatsapp Template' : 'Edit Whatsapp Template'}
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body className="pt-0">
        <div className="row g-4">
          {/* Template Name */}
          <div className="col-12">
            <label htmlFor="template_name" className="form-label fw-semibold">
              Template Name *
            </label>
            <input
              type="text"
              className="form-control form-control-solid"
              id="template_name"
              name="template_name"
              value={template.template_name || ''}
              onChange={handleInputChange}
              placeholder="Enter template name"
              disabled={isUploading}
            />
          </div>

          {/* Template Type */}
          <div className="col-12 col-md-6">
            <label htmlFor="type" className="form-label fw-semibold">
              Template Type *
            </label>
            <select
              className="form-select form-select-solid"
              id="type"
              name="type"
              value={template.type || 'Text'}
              onChange={handleInputChange}
              disabled={isUploading}
            >
              <option value="Text">Text Only</option>
              <option value="ImageText">Image with Text</option>
            </select>
          </div>

          {/* Upload WhatsApp Image - Conditionally shown based on type */}
          {(template.type === 'ImageText' || !template.type) && (
            <div className="col-12 col-md-6">
              <label htmlFor="whatsappImage" className="form-label fw-semibold">
                Upload WhatsApp Image
              </label>
              <div className="input-group">
                <input
                  ref={fileInputRef}
                  type="file"
                  className="form-control form-control-solid"
                  id="whatsappImage"
                  accept="image/jpeg,image/jpg,image/png,image/gif"
                  onChange={handleFileChange}
                  disabled={isUploading}
                />
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                >
                  Choose File
                </button>
              </div>
              
              {/* Image Preview */}
              {(imagePreview || selectedImage) && (
                <div className="mt-3">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <small className="text-muted">Preview:</small>
                    <button
                      type="button"
                      className="btn btn-sm btn-link text-danger p-0"
                      onClick={onClearImage}
                      disabled={isUploading}
                    >
                      Remove
                    </button>
                  </div>
                  <img 
                    src={imagePreview || ''} 
                    alt="Preview" 
                    className="img-thumbnail"
                    style={{ maxHeight: '150px', maxWidth: '100%' }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none'
                    }}
                  />
                </div>
              )}
              
              {/* Show existing image in edit mode if no new image selected */}
              {mode === 'edit' && template.image_url && !imagePreview && !selectedImage && (
                <div className="mt-3">
                  <small className="text-muted d-block mb-2">Current Image:</small>
                  <img 
                    src={template.image_url} 
                    alt="Template preview" 
                    className="img-thumbnail"
                    style={{ maxHeight: '150px', maxWidth: '100%' }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none'
                    }}
                  />
                </div>
              )}
            </div>
          )}

          {/* Message */}
          <div className="col-12">
            <label htmlFor="message" className="form-label fw-semibold">
              Message *
            </label>
            <textarea
              className="form-control form-control-solid"
              id="message"
              name="message"
              value={template.message || ''}
              onChange={handleInputChange}
              placeholder="Enter your message content. Use #LeadName, #Interest, etc. for variables"
              rows={6}
              disabled={isUploading}
            />
            <div className="form-text">
              Available variables: <code>#LeadName</code>, <code>#Interest</code>, <code>#Email</code>, <code>#Phone</code>
            </div>
          </div>
        </div>
      </Modal.Body>

      <Modal.Footer className="border-0 pt-0">
        <div className="d-flex gap-3 w-100">
          <button 
            type="button" 
            className="btn btn-lg btn-primary flex-grow-1"
            onClick={handleSubmit}
            disabled={isUploading}
          >
            {isUploading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                {mode === 'add' ? 'Adding...' : 'Updating...'}
              </>
            ) : (
              'Submit'
            )}
          </button>
          <button 
            type="button" 
            className="btn btn-lg btn-light flex-grow-1"
            onClick={onClose}
            disabled={isUploading}
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