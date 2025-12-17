import React from 'react'
import { RemarksTemplate } from './core/_models'

interface RemarksTemplatesListProps {
  templates: RemarksTemplate[]
  onEdit: (template: RemarksTemplate) => void
  onDelete: (id: number) => void
}

const RemarksTemplatesList: React.FC<RemarksTemplatesListProps> = ({
  templates,
  onEdit,
  onDelete
}) => {
  if (!templates || templates.length === 0) {
    return (
      <div className="text-center py-10">
        <div className="text-muted fs-4">No remarks templates found.</div>
        <div className="text-muted mt-2">
          Get started by creating your first remarks template.
        </div>
      </div>
    )
  }

  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle">
        <thead className="bg-light">
          <tr>
            <th className="ps-6">Sr.No</th>
            <th>Remarks</th>
            <th className="text-end pe-6">Actions</th>
          </tr>
        </thead>
        <tbody>
          {templates.map((template, index) => (
            <tr key={template.id}>
              <td className="ps-6">{index + 1}</td>
              <td>
                <div className="text-muted">{template.content}</div>
              </td>
              <td className="text-end pe-6">
                <div className="d-flex justify-content-end gap-2">
                  <button
                    className="btn btn-sm btn-icon btn-light-primary"
                    onClick={() => onEdit(template)}
                  >
                    <i className="bi bi-pencil"></i>
                  </button>
                  <button
                    className="btn btn-sm btn-icon btn-light-danger"
                    onClick={() => onDelete(template.id)}
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default RemarksTemplatesList