// WhatsAppTemplatesList.tsx
import React from 'react'
import { WhatsAppTemplate } from './core/_models'

interface WhatsAppTemplatesListProps {
  templates: WhatsAppTemplate[]
  onEdit: (template: WhatsAppTemplate) => void
  onDelete: (id: number) => void
}

const WhatsAppTemplatesList: React.FC<WhatsAppTemplatesListProps> = ({
  templates,
  onEdit,
  onDelete
}) => {
  const getStatusBadge = (status: string) => {
    const statusConfig: { [key: string]: { class: string; label: string } } = {
      'APPROVED': { class: 'badge-light-success', label: 'Approved' },
      'PENDING': { class: 'badge-light-warning', label: 'Pending' },
      'REJECTED': { class: 'badge-light-danger', label: 'Rejected' },
      'DISABLED': { class: 'badge-light-secondary', label: 'Disabled' }
    }
    return statusConfig[status] || { class: 'badge-light-primary', label: status }
  }

  const getCategoryBadge = (category: string) => {
    const categoryConfig: { [key: string]: { class: string; label: string } } = {
      'UTILITY': { class: 'badge-light-primary', label: 'Utility' },
      'MARKETING': { class: 'badge-light-success', label: 'Marketing' },
      'AUTHENTICATION': { class: 'badge-light-info', label: 'Authentication' },
      'TRANSACTIONAL': { class: 'badge-light-warning', label: 'Transactional' }
    }
    return categoryConfig[category] || { class: 'badge-light-secondary', label: category }
  }

  return (
    <div className="card">
      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table table-hover table-rounded table-striped border gy-7 gs-7">
            <thead>
              <tr className="fw-bold fs-6 text-gray-800 border-bottom-2 border-gray-200">
                <th>Sr.No</th>
                <th>Template Name</th>
                <th>Message</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {templates.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-10">
                    <div className="d-flex flex-column align-items-center">
                      <i className="bi bi-chat-left-text fs-2x text-muted mb-2"></i>
                      <span className="text-muted fs-6">No templates found</span>
                    </div>
                  </td>
                </tr>
              ) : (
                templates.map((template, index) => {
                  const statusBadge = getStatusBadge(template.status)
                  const categoryBadge = getCategoryBadge(template.category)

                  return (
                    <tr key={template.id}>
                      <td>
                        <span className="text-gray-600">{index + 1}</span>
                      </td>
                      <td>
                        <div className="d-flex flex-column">
                          <span className="fw-bold text-gray-800">{template.name}</span>
                        </div>
                      </td>
                      <td>
                        <div className="d-flex flex-column">
                          <span className="text-gray-800">
                            {template.body.length > 100 ? `${template.body.substring(0, 100)}...` : template.body}
                          </span>
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
                                onClick={() => onEdit(template)}
                              >
                                <i className="bi bi-pencil me-2"></i>
                                Edit
                              </button>
                            </li>
                            <li>
                              <button
                                className="dropdown-item text-danger"
                                onClick={() => onDelete(template.id)}
                              >
                                <i className="bi bi-trash me-2"></i>
                                Delete
                              </button>
                            </li>
                          </ul>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default WhatsAppTemplatesList