// UserModal.tsx
import React from 'react'
import { Modal } from 'react-bootstrap'
import { User } from './core/_models'

interface UserModalProps {
  show: boolean
  onClose: () => void
  mode: 'add' | 'edit'
  user: User
  setUser: (user: User) => void
  onSubmit: () => void
}

const UserModal: React.FC<UserModalProps> = ({
  show,
  onClose,
  mode,
  user,
  setUser,
  onSubmit
}) => {
  // Ensure all fields have defined values (not undefined)
  const safeUser = {
    usermid: user.usermid || 0,
    username: user.username || '',
    userloginid: user.userloginid || '',
    userpassword: user.userpassword || '',
    useremail: user.useremail || '',
    usermobile: user.usermobile || '',
    userrole: user.userrole || 'telecaller',
    usertype: user.usertype || 'User',
    userstatus: user.userstatus || 'Active',
    designation: user.designation || '',
    detail: user.detail || '',
    avatar: user.avatar || 'avatars/300-6.jpg',
    cmpmid: user.cmpmid,
    initials: user.initials || { label: '', state: 'primary' }
  }

  const handleInputChange = (e: React.ChangeEvent<any>) => {
    const { name, value } = e.target
    setUser({
      ...safeUser,
      [name]: value
    })
  }

  return (
    <Modal show={show} onHide={onClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          {mode === 'add' ? 'Add New User' : 'Edit User'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="row g-3">
          <div className="col-md-6">
            <label htmlFor="username" className="form-label">Full Name *</label>
            <input
              type="text"
              className="form-control"
              id="username"
              name="username"
              value={safeUser.username}
              onChange={handleInputChange}
              placeholder="Enter full name"
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="userloginid" className="form-label">Login ID *</label>
            <input
              type="text"
              className="form-control"
              id="userloginid"
              name="userloginid"
              value={safeUser.userloginid}
              onChange={handleInputChange}
              placeholder="Enter login ID"
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="userpassword" className="form-label">
              Password {mode === 'add' ? '*' : ''}
            </label>
            <input
              type="password"
              className="form-control"
              id="userpassword"
              name="userpassword"
              value={safeUser.userpassword}
              onChange={handleInputChange}
              placeholder={mode === 'add' ? 'Enter Password' : 'Leave blank to keep current password'}
            />
            {mode === 'edit' && (
              <div className="form-text text-muted">
                Leave password blank to keep the current password
              </div>
            )}
          </div>
          <div className="col-md-6">
            <label htmlFor="useremail" className="form-label">Email *</label>
            <input
              type="email"
              className="form-control"
              id="useremail"
              name="useremail"
              value={safeUser.useremail}
              onChange={handleInputChange}
              placeholder="Enter email address"
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="usermobile" className="form-label">Mobile</label>
            <input
              type="text"
              className="form-control"
              id="usermobile"
              name="usermobile"
              value={safeUser.usermobile}
              onChange={handleInputChange}
              placeholder="Enter mobile number"
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="userrole" className="form-label">User Role</label>
            <select
              className="form-select"
              id="userrole"
              name="userrole"
              value={safeUser.userrole}
              onChange={handleInputChange}
            >
              <option value="teamleader">Team Leader</option>
              <option value="manager">Manager</option>
              <option value="telecaller">Telecaller</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="col-md-6">
            <label htmlFor="usertype" className="form-label">User Type</label>
            <select
              className="form-select"
              id="usertype"
              name="usertype"
              value={safeUser.usertype}
              onChange={handleInputChange}
            >
              <option value="User">User</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          <div className="col-md-6">
            <label htmlFor="userstatus" className="form-label">Status</label>
            <select
              className="form-select"
              id="userstatus"
              name="userstatus"
              value={safeUser.userstatus}
              onChange={handleInputChange}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div className="col-md-6">
            <label htmlFor="designation" className="form-label">Designation</label>
            <input
              type="text"
              className="form-control"
              id="designation"
              name="designation"
              value={safeUser.designation}
              onChange={handleInputChange}
              placeholder="Enter designation"
            />
          </div>
          <div className="col-12">
            <label htmlFor="detail" className="form-label">Details</label>
            <textarea
              className="form-control"
              id="detail"
              name="detail"
              value={safeUser.detail}
              onChange={handleInputChange}
              placeholder="Enter additional details"
              rows={3}
            />
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <button type="button" className="btn btn-light" onClick={onClose}>
          Cancel
        </button>
        <button type="button" className="btn btn-primary" onClick={onSubmit}>
          {mode === 'add' ? 'Add User' : 'Update User'}
        </button>
      </Modal.Footer>
    </Modal>
  )
}

export default UserModal