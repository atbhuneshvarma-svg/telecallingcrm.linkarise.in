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
  const getTypeBadge = (type: string) => {
    const typeConfig: { [key: string]: { class: string; label: string } } = {
      'ImageText': { class: 'badge-light-primary', label: 'Image & Text' },
      'Text': { class: 'badge-light-info', label: 'Text Only' },
      'IMAGE': { class: 'badge-light-success', label: 'Image Only' },
      'VIDEO': { class: 'badge-light-warning', label: 'Video' },
      'DOCUMENT': { class: 'badge-light-danger', label: 'Document' }
    }
    return typeConfig[type] || { class: 'badge-light-secondary', label: type || 'Unknown' }
  }

  const getStatusBadge = (status?: string) => {
    const statusConfig: { [key: string]: { class: string; label: string } } = {
      'APPROVED': { class: 'badge-light-success', label: 'Approved' },
      'PENDING': { class: 'badge-light-warning', label: 'Pending' },
      'REJECTED': { class: 'badge-light-danger', label: 'Rejected' },
      'DISABLED': { class: 'badge-light-secondary', label: 'Disabled' },
      'ACTIVE': { class: 'badge-light-success', label: 'Active' }
    }
    return statusConfig[status || 'ACTIVE'] || { class: 'badge-light-primary', label: status || 'Unknown' }
  }

  const getCategoryBadge = (category?: string) => {
    const categoryConfig: { [key: string]: { class: string; label: string } } = {
      'UTILITY': { class: 'badge-light-primary', label: 'Utility' },
      'MARKETING': { class: 'badge-light-success', label: 'Marketing' },
      'AUTHENTICATION': { class: 'badge-light-info', label: 'Authentication' },
      'TRANSACTIONAL': { class: 'badge-light-warning', label: 'Transactional' }
    }
    return categoryConfig[category || 'UTILITY'] || { class: 'badge-light-secondary', label: category || 'Other' }
  }

  const getImagePreview = (template: WhatsAppTemplate) => {
    if (!template.whatsappimage || template.whatsappimage === '' ||
      template.whatsappimage === 'blank.png' ||
      template.image_url?.includes('blank.png')) {
      return (
        <div className="text-muted">
          <i className="bi bi-image fs-4"></i>
          <div className="fs-8">No image</div>
        </div>
      )
    }

    if (template.image_url) {
      return (
        <div>
          <img
            src={template.image_url}
            alt={template.template_name || template.name}
            className="rounded border"
            style={{ width: '50px', height: '50px', objectFit: 'cover' }}
          />
        </div>
      )
    }
    return null
  }

  const handleDelete = (template: WhatsAppTemplate) => {
    const id = template.wtmid || template.id
    if (id) {
      onDelete(id)
    } else {
      console.error('Cannot delete template: No ID found', template)
    }
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
                <th>Type</th>
                <th>Message</th>
                <th>Image</th>
                <th>Status</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {templates.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10">
                    <div className="d-flex flex-column align-items-center">
                      <i className="bi bi-chat-left-text fs-2x text-muted mb-2"></i>
                      <span className="text-muted fs-6">No templates found</span>
                    </div>
                  </td>
                </tr>
              ) : (
                templates.map((template, index) => {
                  const typeBadge = getTypeBadge(template.type || 'Text')
                  const statusBadge = getStatusBadge(template.status)
                  const categoryBadge = getCategoryBadge(template.category)

                  return (
                    <tr key={template.wtmid || template.id || index}>
                      <td>
                        <span className="text-gray-600">{index + 1}</span>
                      </td>
                      <td>
                        <div className="d-flex flex-column">
                          <span className="fw-bold text-gray-800">
                            {template.template_name || template.name}
                          </span>
                          <span className={`badge ${categoryBadge.class} fs-8 mt-1`}>
                            {categoryBadge.label}
                          </span>
                          <small className="text-muted fs-8 mt-1">
                            ID: {template.wtmid || template.id || 'N/A'}
                          </small>
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${typeBadge.class}`}>
                          {typeBadge.label}
                        </span>
                      </td>
                      <td>
                        <div className="d-flex flex-column">
                          <span className="text-gray-800">
                            {template.message || template.body
                              ? template.message
                                ? template.message.split(' ').slice(0, 5).join(' ') + (template.message.split(' ').length > 5 ? '...' : '')
                                : template.body
                                  ? template.body.split(' ').slice(0, 5).join(' ') + (template.body.split(' ').length > 5 ? '...' : '')
                                  : 'No message'
                              : 'No message'
                            }
                          </span>
                          <small className="text-muted mt-1">
                            {template.created_at ? new Date(template.created_at).toLocaleDateString() : ''}
                          </small>
                        </div>
                      </td>
                      <td>
                        {getImagePreview(template)}
                      </td>
                      <td>
                        <span className={`badge ${statusBadge.class}`}>
                          {statusBadge.label}
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
                                onClick={() => onEdit(template)}
                              >
                                <i className="bi bi-pencil me-2"></i>
                                Edit
                              </button>
                            </li>
                            <li>
                              <button
                                className="dropdown-item text-danger"
                                onClick={() => handleDelete(template)}
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