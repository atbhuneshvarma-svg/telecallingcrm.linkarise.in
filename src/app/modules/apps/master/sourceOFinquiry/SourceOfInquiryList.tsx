// src/app/modules/apps/master/source-of-inquiry/SourceOfInquiryList.tsx
import React from 'react'
import { SourceOfInquiry } from './core/_request'

interface SourceOfInquiryListProps {
  sourceOfInquiries: SourceOfInquiry[]
  onEditSourceOfInquiry: (sourceOfInquiry: SourceOfInquiry) => void
  onDeleteSourceOfInquiry: (id: number) => void
}

const SourceOfInquiryList: React.FC<SourceOfInquiryListProps> = ({ 
  sourceOfInquiries, 
  onEditSourceOfInquiry, 
  onDeleteSourceOfInquiry 
}) => {
  return (
    <div className="table-responsive">
      <table className="table table-hover table-rounded table-striped border gy-7 gs-7">
        <thead>
          <tr className="fw-bold fs-6 text-gray-800 border-bottom-2 border-gray-200">
            <th>Sr.No</th>
            <th>Source of Inquiry Name</th>
            <th className="text-end">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sourceOfInquiries.length === 0 ? (
            <tr>
              <td colSpan={3} className="text-center py-10">
                <div className="d-flex flex-column align-items-center">
                  <i className="bi bi-inbox fs-2x text-muted mb-2"></i>
                  <span className="text-muted fs-6">No source of inquiries found</span>
                </div>
              </td>
            </tr>
          ) : (
            sourceOfInquiries.map((sourceOfInquiry, index) => (
              <tr key={sourceOfInquiry.id}>
                <td>
                  <span className="text-gray-600">{index + 1}</span>
                </td>
                <td>
                  <div className="d-flex flex-column">
                    <span className="fw-bold text-gray-800">{sourceOfInquiry.name}</span>
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
                          onClick={() => onEditSourceOfInquiry(sourceOfInquiry)}
                        >
                          <i className="bi bi-pencil me-2"></i>
                          Edit
                        </button>
                      </li>
                      <li>
                        <button
                          className="dropdown-item text-danger"
                          onClick={() => onDeleteSourceOfInquiry(sourceOfInquiry.id)}
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

export default SourceOfInquiryList