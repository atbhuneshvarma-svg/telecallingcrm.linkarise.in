// src/app/modules/apps/master/purpose/PurposeList.tsx
import React from 'react'
import { Purpose } from './core/_request'

interface PurposeListProps {
  purposes: Purpose[]
  onEdit: (purpose: Purpose) => void
  onDelete: (id: number) => void
  loading?: boolean
}

// Skeleton loader component
const PurposeListSkeleton = () => (
  <div className="table-responsive">
    <table className="table table-hover table-striped border">
      <thead>
        <tr className="fw-bold fs-6 text-gray-800 border-bottom border-gray-200 text-center">
          <th >#</th>
          <th>Purpose Name</th>
          <th className="text-center">Actions</th>
        </tr>
      </thead>
      <tbody>
        {[...Array(5)].map((_, index) => (
          <tr key={index} className="text-center">
            <td>
              <div className="skeleton-loading h-20px w-30px mx-auto"></div>
            </td>
            <td>
              <div className="skeleton-loading h-25px w-200px mx-auto"></div>
            </td>
            <td>
              <div className="skeleton-loading h-32px w-100px mx-auto"></div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)

const PurposeList: React.FC<PurposeListProps> = ({ 
  purposes, 
  onEdit, 
  onDelete, 
  loading = false 
}) => {
  if (loading) {
    return <PurposeListSkeleton />
  }

  return (
    <div className="card">
      <div className="card-body p-0">
        {/* Desktop Table */}
        <div className="d-none d-lg-block">
          <div className="table-responsive">
            <table className="table  table-bordered table-rounded table-hover border mb-0">
              <thead>
                <tr className="fw-semibold fs-7 text-gray-600 border-bottom">
                  <th  className="text-center">#</th>
                  <th className="text-center">Purpose Name</th>
                  <th  className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {purposes.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="text-center py-10">
                      <div className="d-flex flex-column align-items-center">
                        <i className="bi bi-bullseye fs-2x text-muted mb-2"></i>
                        <span className="text-muted fs-6">No purposes found</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  purposes.map((purpose, index) => (
                    <tr key={purpose.id}>
                      <td className="text-center">
                        <span className="text-gray-600 fs-7">{index + 1}</span>
                      </td>
                      <td>
                        <div className="d-flex align-items-center justify-content-center">
                          <div className=" center symbol symbol-35px symbol-circle bg-light-primary">
                            <div className="symbol-label text-primary">
                              <i className="bi bi-bullseye fs-6"></i>
                            </div>
                          </div>
                          <span className="fw-medium text-gray-800 fs-7">{purpose.name}</span>
                        </div>
                      </td>
                      <td className="text-center">
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
                                onClick={() => onEdit(purpose)}
                              >
                                <i className="bi bi-pencil me-2"></i>
                                Edit
                              </button>
                            </li>
                            <li>
                              <button
                                className="dropdown-item text-danger"
                                onClick={() => onDelete(purpose.id)}
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
          {purposes.length === 0 ? (
            <div className="text-center py-8">
              <i className="bi bi-bullseye fs-2x text-muted mb-2"></i>
              <span className="text-muted fs-6 d-block">No purposes found</span>
            </div>
          ) : (
            <div className="p-2">
              {purposes.map((purpose, index) => (
                <div key={purpose.id} className="card border mb-2">
                  <div className="card-body py-3">
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="d-flex align-items-center">
                        <div className="symbol symbol-40px symbol-circle me-3 bg-light-primary">
                          <div className="symbol-label text-primary">
                            <i className="bi bi-bullseye fs-6"></i>
                          </div>
                        </div>
                        <div className="d-flex flex-column">
                          <span className="fw-medium text-gray-800 fs-7">{purpose.name}</span>
                          <span className="text-muted fs-8">#{index + 1}</span>
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
                              onClick={() => onEdit(purpose)}
                            >
                              <i className="bi bi-pencil me-2"></i>
                              Edit
                            </button>
                          </li>
                          <li>
                            <button 
                              className="dropdown-item text-danger" 
                              onClick={() => onDelete(purpose.id)}
                            >
                              <i className="bi bi-trash me-2"></i>
                              Delete
                            </button>
                          </li>
                        </ul>
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

export default PurposeList