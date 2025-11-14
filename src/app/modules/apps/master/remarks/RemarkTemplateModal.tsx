import React from 'react'
import { RemarksTemplate } from './core/_models'

interface RemarkTemplateModalProps {
  show: boolean
  onClose: () => void
  mode: 'add' | 'edit'
  template: RemarksTemplate
  setTemplate: (template: RemarksTemplate) => void
  onSubmit: () => void
  loading?: boolean
}

const RemarkTemplateModal: React.FC<RemarkTemplateModalProps> = ({
  show,
  onClose,
  mode,
  template,
  setTemplate,
  onSubmit,
  loading = false
}) => {
  if (!show) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit()
  }

  return (
    <div className="modal fade show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          {/* Modal Header */}
          <div className="modal-header pb-3 border-0">
            <h4 className="modal-title fw-bold">
              {mode === 'add' ? 'Add Remarks Template' : 'Edit Remarks Template'}
            </h4>
            <button 
              type="button" 
              className="btn-close" 
              onClick={onClose}
              disabled={loading}
            ></button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="modal-body py-1">
              {/* Content - Only field shown */}
              <div className="mb-4">
                <label className="form-label fw-semibold">Remarks *</label>
                <textarea
                  className="form-control"
                  rows={6}
                  value={template.content}
                  onChange={(e) => setTemplate({ ...template, content: e.target.value })}
                  placeholder="Enter your remarks template..."
                  required
                  disabled={loading}
                />
              </div>
            </div>
            
            {/* Modal Footer */}
            <div className="modal-footer border-0 pt-3">
              <button 
                type="button" 
                className="btn btn-light" 
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Submitting...
                  </>
                ) : (
                  'Submit'
                )}
              </button>
            </div>
          </form>

          {/* Footer Copyright */}
          <div className="modal-footer border-0 justify-content-center pt-0">
            <div className="text-center text-gray-500">
              2025@ Arth Technology
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RemarkTemplateModal