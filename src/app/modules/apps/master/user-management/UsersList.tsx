// UsersList.tsx
import React from 'react'
import { User } from './core/_models'

interface UsersListProps {
  users: User[]
  onEdit: (user: User) => void
  onDelete: (id: number) => void
  loading?: boolean
}

// Skeleton loader component
const UsersListSkeleton = () => (
  <div className="card">
    <div className="card-body p-0">
      <div className="table-responsive">
        <table className="table table-hover table-rounded table-striped border gy-7 gs-7">
          <thead>
            <tr className="fw-bold fs-6 text-gray-800 border-bottom-2 border-gray-200">
              <th>Sr.No</th>
              <th>Name</th>
              <th>Email</th>
              <th>Login ID</th>
              <th>Type</th>
              <th>Status</th>
              <th className="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {[...Array(5)].map((_, index) => (
              <tr key={index}>
                <td>
                  <div className="d-flex align-items-center">
                    <div className="skeleton-loading symbol symbol-50px symbol-circle me-3"></div>
                    <div className="d-flex flex-column w-100">
                      <div className="skeleton-loading h-20px w-150px mb-2"></div>
                      <div className="skeleton-loading h-15px w-100px"></div>
                    </div>
                  </div>
                </td>
                <td><div className="skeleton-loading h-20px w-200px"></div></td>
                <td><div className="skeleton-loading h-20px w-120px"></div></td>
                <td><div className="skeleton-loading h-20px w-100px"></div></td>
                <td><div className="skeleton-loading h-25px w-60px"></div></td>
                <td><div className="skeleton-loading h-25px w-70px"></div></td>
                <td><div className="skeleton-loading h-32px w-80px float-end"></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
)

// Helper functions
const getUserTypeBadgeClass = (type: string) => {
  const classes = {
    'Admin': 'badge-light-danger',
    'User': 'badge-light-primary',
    'Moderator': 'badge-light-warning'
  }
  return classes[type as keyof typeof classes] || 'badge-light-secondary'
}

const getUserStatusBadgeClass = (status: string) => {
  const classes = {
    'Active': 'badge-light-success',
    'Inactive': 'badge-light-danger',
    'Pending': 'badge-light-warning'
  }
  return classes[status as keyof typeof classes] || 'badge-light-secondary'
}

const getUserTypeIcon = (type: string) => {
  const icons = {
    'Admin': 'bi-shield-check',
    'User': 'bi-person',
    'Moderator': 'bi-shield'
  }
  return icons[type as keyof typeof icons] || 'bi-person'
}

const getUserStatusIcon = (status: string) => {
  const icons = {
    'Active': 'bi-check-circle',
    'Inactive': 'bi-x-circle',
    'Pending': 'bi-clock'
  }
  return icons[status as keyof typeof icons] || 'bi-question-circle'
}

const UsersList: React.FC<UsersListProps> = ({ users, onEdit, onDelete, loading = false }) => {
  if (loading) {
    return <UsersListSkeleton />
  }

  return (
    <div className="card">
      <div className="card-body p-0">
        {/* Desktop Table */}
        <div className="d-none d-lg-block">
          <div className="table-responsive">
            <table className="table table-hover table-rounded table-striped border gy-7 gs-7">
              <thead>
                <tr className=" fw-bold fs-6 text-gray-800 border-bottom-2 border-gray-200">
                  <th className="px-4 py-3 text-uppercase font-sm text-muted">Sr.No</th>
                  <th className="px-4 py-3 text-uppercase font-sm text-muted">Name</th>
                  <th className="px-4 py-3 text-uppercase font-sm text-muted">Email</th>
                  <th className="px-4 py-3 text-uppercase font-sm text-muted">LoginID</th>
                  <th className="px-4 py-3 text-uppercase font-sm text-muted">Type</th>
                  <th className="px-4 py-3 text-uppercase font-sm text-muted">Status</th>
                  <th className="px-4 py-3 text-uppercase font-sm text-muted">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-15">
                      <div className="d-flex flex-column align-items-center">
                        <i className="bi bi-people fs-2x text-gray-400 mb-3"></i>
                        <span className="text-gray-600 fs-5 fw-semibold mb-2">No users found</span>
                        <span className="text-muted fs-7">Try adjusting your search or add a new user</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  users.map((user, index) => (
                    <tr className='align-middle' key={user.usermid}>
                      <td className="px-4 py-3 fw-semibold">{index + 1}</td>
                      <td>
                        <div className="d-flex align-items-center px-4 py-3">
                          <div className="symbol symbol-50px symbol-circle me-3">
                            <div className={`symbol-label bg-light-${user.initials?.state || 'primary'}`}>
                              <span className="text-uppercase fs-6">{user.initials?.label || user.username.charAt(0)}</span>
                            </div>
                          </div>
                          <div className="d-flex flex-column">
                            <span className="fw-bold text-gray-800">{user.username}</span>
                            <span className="text-muted fs-7">{user.designation}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="text-gray-800">{user.useremail}</span>
                      </td>
                      <td>
                        <span className="text-gray-600">{user.userloginid}</span>
                      </td>
                      <td>
                        <span className={`badge badge-lg ${getUserTypeBadgeClass(user.userrole)}`}>
                          <i className={`bi ${getUserTypeIcon(user.userrole)} me-1`}></i>
                          {user.userrole}
                        </span>
                      </td>
                      <td>
                        <span className={`badge badge-lg ${getUserStatusBadgeClass(user.userstatus)}`}>
                          <i className={`bi ${getUserStatusIcon(user.userstatus)} me-1`}></i>
                          {user.userstatus}
                        </span>
                      </td>
                      <td className="text-end">
                        <div className="dropdown">
                          <button
                            className="btn btn-sm btn-light btn-active-light-primary"
                            type="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          >
                            Actions
                            <i className="bi bi-chevron-down ms-2"></i>
                          </button>
                          <ul className="dropdown-menu">
                            <li>
                              <button
                                className="dropdown-item"
                                onClick={() => onEdit(user)}
                              >
                                <i className="bi bi-pencil me-2"></i>
                                Edit
                              </button>
                            </li>
                            <li>
                              <button
                                className="dropdown-item text-danger"
                                onClick={() => onDelete(user.usermid)}
                              >
                                <i className="bi bi-trash me-2"></i>
                                Delete
                              </button>
                            </li>
                          </ul>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Cards */}
        <div className="d-lg-none">
          {users.length === 0 ? (
            <div className="text-center py-10">
              <i className="bi bi-people fs-2x text-muted mb-2"></i>
              <span className="text-muted fs-6 d-block">No users found</span>
            </div>
          ) : (
            <div className="row g-4 p-4">
              {users.map((user) => (
                <div key={user.usermid} className="col-12">
                  <div className="card card-flat border">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <div className="d-flex align-items-center">
                          <div className="symbol symbol-50px symbol-circle me-3">
                            <div className={`symbol-label bg-light-${user.initials?.state || 'primary'}`}>
                              <span className="text-uppercase fs-6">{user.initials?.label || user.username.charAt(0)}</span>
                            </div>
                          </div>
                          <div className="d-flex flex-column">
                            <span className="fw-bold text-gray-800">{user.username}</span>
                            <span className="text-muted fs-7">{user.designation}</span>
                          </div>
                        </div>
                        <div className="dropdown">
                          <button
                            className="btn btn-sm btn-light"
                            type="button"
                            data-bs-toggle="dropdown"
                          >
                            <i className="bi bi-three-dots-vertical"></i>
                          </button>
                          <ul className="dropdown-menu">
                            <li>
                              <button
                                className="dropdown-item"
                                onClick={() => onEdit(user)}
                              >
                                <i className="bi bi-pencil me-2"></i>
                                Edit
                              </button>
                            </li>
                            <li>
                              <button
                                className="dropdown-item text-danger"
                                onClick={() => onDelete(user.usermid)}
                              >
                                <i className="bi bi-trash me-2"></i>
                                Delete
                              </button>
                            </li>
                          </ul>
                        </div>
                      </div>

                      <div className="row g-2">
                        <div className="col-6">
                          <small className="text-muted">Email</small>
                          <div className="fw-semibold text-truncate">{user.useremail}</div>
                        </div>
                        <div className="col-6">
                          <small className="text-muted">Mobile</small>
                          <div className="fw-semibold">{user.usermobile}</div>
                        </div>
                        <div className="col-6">
                          <small className="text-muted">Login ID</small>
                          <div className="fw-semibold text-truncate">{user.userloginid}</div>
                        </div>
                        <div className="col-6">
                          <small className="text-muted">Type</small>
                          <div>
                            <span className={`badge badge-sm ${getUserTypeBadgeClass(user.userrole)}`}>
                              <i className={`bi ${getUserTypeIcon(user.userrole)} me-1`}></i>
                              {user.userrole}
                            </span>
                          </div>
                        </div>
                        <div className="col-6">
                          <small className="text-muted">Status</small>
                          <div>
                            <span className={`badge badge-sm ${getUserStatusBadgeClass(user.userstatus)}`}>
                              <i className={`bi ${getUserStatusIcon(user.userstatus)} me-1`}></i>
                              {user.userstatus}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default UsersList