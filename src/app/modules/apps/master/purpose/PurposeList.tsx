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
  <div className="card shadow-sm">
    <div className="card-body p-0">
      <div className="table-responsive">
        <table className="table table-hover table-rounded table-striped border gy-7 gs-7">
          <thead>
            <tr className="fw-bold fs-6 text-gray-800 border-bottom-2 border-gray-200">
              <th>#</th>
              <th>Purpose Name</th>
              <th className="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {[...Array(5)].map((_, index) => (
              <tr key={index}>
                <td>
                  <div className="skeleton-loading h-20px w-30px"></div>
                </td>
                <td>
                  <div className="skeleton-loading h-25px w-200px"></div>
                </td>
                <td>
                  <div className="skeleton-loading h-32px w-100px float-end"></div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
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
    <div className="card shadow-sm">
      <div className="card-body p-0">
        {/* Desktop Table */}
        <div className="d-none d-lg-block">
          <div className="table-responsive">
            <table className="table table-hover table-rounded table-striped border gy-7 gs-7">
              <thead>
                <tr className="fw-bold fs-6 text-gray-800 border-bottom-2 border-gray-200">
                  <th>#</th>
                  <th>Purpose Name</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {purposes.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="text-center py-15">
                      <div className="d-flex flex-column align-items-center">
                        <i className="bi bi-bullseye fs-2x text-gray-400 mb-3"></i>
                        <span className="text-gray-600 fs-5 fw-semibold mb-2">No purposes found</span>
                        <span className="text-muted fs-7">Try adjusting your search or add a new purpose</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  purposes.map((purpose, index) => (
                    <tr key={purpose.id}>
                      <td>
                        <span className="fw-semibold text-gray-700">{index + 1}</span>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="symbol symbol-40px symbol-circle me-3">
                            <div className="symbol-label bg-light-primary">
                              <i className="bi bi-bullseye text-primary fs-5"></i>
                            </div>
                          </div>
                          <span className="fw-bold text-gray-800 fs-6">{purpose.name}</span>
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
            <div className="text-center py-10">
              <i className="bi bi-bullseye fs-2x text-muted mb-2"></i>
              <span className="text-muted fs-6 d-block">No purposes found</span>
            </div>
          ) : (
            <div className="row g-3 p-3">
              {purposes.map((purpose, index) => (
                <div key={purpose.id} className="col-12">
                  <div className="card card-flat border">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <div className="d-flex align-items-center">
                          <div className="symbol symbol-50px symbol-circle me-3 bg-light-primary">
                            <div className="symbol-label text-primary">
                              <i className="bi bi-bullseye fs-4"></i>
                            </div>
                          </div>
                          <div className="d-flex flex-column">
                            <span className="fw-bold text-gray-800">{purpose.name}</span>
                            <span className="text-muted fs-7">#{index + 1}</span>
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
                      
                      <div className="row g-2 mt-3">
                        <div className="col-6">
                          <button
                            className="btn btn-outline-success btn-sm w-100"
                            onClick={() => onEdit(purpose)}
                          >
                            <i className="bi bi-pencil me-1"></i>
                            Edit
                          </button>
                        </div>
                        <div className="col-6">
                          <button
                            className="btn btn-outline-danger btn-sm w-100"
                            onClick={() => onDelete(purpose.id)}
                          >
                            <i className="bi bi-trash me-1"></i>
                            Delete
                          </button>
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

export default PurposeList