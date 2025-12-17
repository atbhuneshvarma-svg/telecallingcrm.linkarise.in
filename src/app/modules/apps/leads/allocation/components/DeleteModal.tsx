// components/DeleteModal.tsx
import React from 'react'

interface Props {
  selectedLeads: number[]
  handleDelete: () => void
  onClose: () => void
  loading?: boolean // Add this line
}

const DeleteModal: React.FC<Props> = ({
  selectedLeads,
  handleDelete,
  onClose,
  loading = false // Add default value
}) => {
  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Delete Leads</h5>
            <button 
              type="button" 
              className="btn-close" 
              onClick={onClose}
              disabled={loading}
            ></button>
          </div>
          <div className="modal-body">
            <p>
              Are you sure you want to delete {selectedLeads.length} selected lead(s)?
              This action cannot be undone.
            </p>
          </div>
          <div className="modal-footer">
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="button" 
              className="btn btn-danger" 
              onClick={handleDelete}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  Deleting...
                </>
              ) : (
                'Delete Leads'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DeleteModal