// src/app/modules/apps/manage/teams/components/DeleteModal.tsx
import React from 'react'

interface Props {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  teamName: string
  loading?: boolean
}

const DeleteModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onConfirm,
  teamName,
  loading = false
}) => {
  if (!isOpen) return null

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title text-danger">Delete Team</h5>
            <button 
              type="button" 
              className="btn-close" 
              onClick={onClose}
              disabled={loading}
            ></button>
          </div>
          <div className="modal-body">
            <p>
              Are you sure you want to delete the team <strong>"{teamName}"</strong>?
            </p>
            <p className="text-muted mb-0">
              This action cannot be undone and all team data will be permanently removed.
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
              onClick={onConfirm}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  Deleting...
                </>
              ) : (
                'Delete Team'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DeleteModal