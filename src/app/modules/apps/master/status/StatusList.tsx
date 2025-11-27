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
    <>
      <div className="container-fluid px-0">


        <div className="table-responsive">
          <table className="table table-hover table-bordered table-rounded table-striped border">
            <thead>
              <tr className="fw-bold fs-6 text-gray-800 border-bottom-2 border-gray-200 text-center">
                <th>Sr.No</th>
                <th>Status Name</th>
                <th>Status Color</th>
                <th>stage</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {statuses.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-10">
                    <div className="d-flex flex-column align-items-center">
                      <i className="bi bi-inbox fs-2x text-muted mb-2"></i>
                      <span className="text-muted fs-6">No statuses found</span>
                    </div>
                  </td>
                </tr>
              ) : (
                statuses.map((status, index) => (
                  <tr className='text-center' key={status.id}>
                    <td>
                      <span className="text-gray-600">{index + 1}</span>
                    </td>
                    <td width={120} >
                      <div style={{backgroundColor: status.color , padding:'15px', borderRadius:'8px' , paddingBottom: '20px' }} className="d-flex flex-column">
                        <span className="fw-bold text-white fs-7"
                        
                        >{status.name}</span>
                      </div>
                    </td>
                    <td >
                      <div  className="align-items-center gap-2 text-center d-flex justify-content-center">
                        <span className="badge badge-light fs-7">{status.color}</span>
                      </div>
                    </td>
                    <td >
                      <div className="align-items-center gap-2 text-center d-flex justify-content-center">
                        <span className="fs-7">{status.stage}</span>
                      </div>
                    </td>
                    <td>
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
      </div>
    </>
  )
}

export default StatusList