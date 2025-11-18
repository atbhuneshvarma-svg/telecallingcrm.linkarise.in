import React, { useState } from 'react'
import { User } from '../core/_models'

interface AddMemberModalProps {
  isOpen: boolean
  onClose: () => void
  onAddMember: (usermid: number) => void
  users: User[]
  loading: boolean
}

export const AddMemberModal: React.FC<AddMemberModalProps> = ({
  isOpen,
  onClose,
  onAddMember,
  users,
  loading
}) => {
  const [selectedUsermid, setSelectedUsermid] = useState<number>(0)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedUsermid) {
      onAddMember(selectedUsermid)
      setSelectedUsermid(0)
    }
  }

  const handleClose = () => {
    setSelectedUsermid(0)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="modal fade show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Add Team Member</h5>
            <button
              type="button"
              className="btn-close"
              onClick={handleClose}
              disabled={loading}
            ></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label fw-semibold">Select Sales Executive *</label>
                <select
                  className="form-select"
                  value={selectedUsermid}
                  onChange={(e) => setSelectedUsermid(Number(e.target.value))}
                  required
                  disabled={loading}
                >
                  <option value={0}>Select Sales Executive</option>
                  {users.map(user => (
                    <option key={user.usermid} value={user.usermid}>
                      {user.username} - {user.userrole}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleClose}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={!selectedUsermid || loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Adding...
                  </>
                ) : (
                  'Add Member'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}