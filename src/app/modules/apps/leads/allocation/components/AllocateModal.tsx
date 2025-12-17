// components/AllocateModal.tsx
import React from 'react'

interface User {
  usermid: number
  username: string
  useremail: string
}

interface Props {
  users: User[]
  selectedLeads: number[]
  assignTo: string
  setAssignTo: (value: string) => void
  handleAllocate: () => void
  onClose: () => void
  loading?: boolean // Make sure this exists
}

const AllocateModal: React.FC<Props> = ({
  users,
  selectedLeads,
  assignTo,
  setAssignTo,
  handleAllocate,
  onClose,
  loading = false
}) => {
  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Allocate Leads</h5>
            <button 
              type="button" 
              className="btn-close" 
              onClick={onClose}
              disabled={loading}
            ></button>
          </div>
          <div className="modal-body">
            <p>Allocate {selectedLeads.length} selected lead(s) to:</p>
            <select
              className="form-select"
              value={assignTo}
              onChange={(e) => setAssignTo(e.target.value)}
              disabled={loading}
            >
              <option value="">Select User</option>
              {users.map(user => (
                <option key={user.usermid} value={user.usermid}>
                  {user.username} ({user.useremail})
                </option>
              ))}
            </select>
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
              className="btn btn-primary" 
              onClick={handleAllocate}
              disabled={!assignTo || loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  Allocating...
                </>
              ) : (
                'Allocate Leads'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AllocateModal