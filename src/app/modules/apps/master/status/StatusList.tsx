// StatusList.tsx
import React from 'react'
import { Status } from './core/_request'

interface StatusListProps {
  statuses: Status[]
  onEditStatus: (status: Status) => void
  onDeleteStatus: (id: number) => void
}

const StatusList: React.FC<StatusListProps> = ({ 
  statuses, 
  onEditStatus, 
  onDeleteStatus 
}) => {
  return (
    <div className="table-responsive">
      <table className="table table-hover table-rounded table-striped border gy-7 gs-7">
        <thead>
          <tr className="fw-bold fs-6 text-gray-800 border-bottom-2 border-gray-200">
            <th>Sr.No</th>
            <th>Status Name</th>
            <th>Status Color</th>
            <th className="text-end">Actions</th>
          </tr>
        </thead>
        <tbody>
          {statuses.length === 0 ? (
            <tr>
              <td colSpan={4} className="text-center py-10">
                <div className="d-flex flex-column align-items-center">
                  <i className="bi bi-inbox fs-2x text-muted mb-2"></i>
                  <span className="text-muted fs-6">No statuses found</span>
                </div>
              </td>
            </tr>
          ) : (
            statuses.map((status, index) => (
              <tr key={status.id}>
                <td>
                  <span className="text-gray-600">{index + 1}</span>
                </td>
                <td>
                  <div className="d-flex flex-column">
                    <span className="fw-bold text-gray-800">{status.name}</span>
                  </div>
                </td>
                <td>
                  <div className="d-flex align-items-center gap-2">
                    <div 
                      className="color-preview rounded border"
                      style={{
                        backgroundColor: status.color,
                        width: '20px',
                        height: '20px'
                      }}
                    ></div>
                    <span className="text-muted fs-7">{status.color}</span>
                  </div>
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
                          onClick={() => onEditStatus(status)}
                        >
                          <i className="bi bi-pencil me-2"></i>
                          Edit
                        </button>
                      </li>
                      <li>
                        <button
                          className="dropdown-item text-danger"
                          onClick={() => onDeleteStatus(status.id)}
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
  )
}

export default StatusList