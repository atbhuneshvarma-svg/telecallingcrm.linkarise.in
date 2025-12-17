import React, { useEffect, useState } from 'react'
import RemarkTemplateModal from './RemarkTemplateModal'
import RemarksTemplatesList from './RemarksTemplatesList'
import { remarksTemplateApi, handleApiError } from './core/_requests'
import { RemarksTemplate, PaginationInfo } from './core/_models'

const RemarksTemplatesMaster = () => {
  // State for server-side pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [entriesPerPage, setEntriesPerPage] = useState(10)
  const [pagination, setPagination] = useState<PaginationInfo>({
    current_page: 1,
    per_page: 10,
    total_records: 0,
    total_pages: 1
  })

  const [showModal, setShowModal] = useState(false)
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add')
  const [searchTerm, setSearchTerm] = useState('')
  const [templates, setTemplates] = useState<RemarksTemplate[]>([])
  const [currentTemplate, setCurrentTemplate] = useState<RemarksTemplate>({ 
    id: 0,
    content: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState(false)

  // Fetch templates when page or entries per page changes
  useEffect(() => {
    fetchTemplates()
  }, [currentPage, entriesPerPage])

  const fetchTemplates = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await remarksTemplateApi.getTemplatesPaginated(currentPage, entriesPerPage)
      setTemplates(response.data || [])
      setPagination({
        current_page: response.current_page,
        per_page: response.per_page,
        total_records: response.total_records,
        total_pages: response.total_pages
      })
    } catch (error) {
      const errorMessage = handleApiError(error)
      setError(errorMessage)
      console.error('Error fetching templates:', error)
      setTemplates([])
    } finally {
      setLoading(false)
    }
  }

  const handleEntriesChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newPerPage = Number(e.target.value)
    setEntriesPerPage(newPerPage)
    setCurrentPage(1)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleAddOrUpdateTemplate = async () => {
    if (!currentTemplate.content?.trim()) {
      setError('Remarks content is required')
      return
    }

    setActionLoading(true)
    setError(null)
    
    try {
      if (modalMode === "add") {
        await remarksTemplateApi.createTemplate({
          content: currentTemplate.content
        })
      } else {
        await remarksTemplateApi.updateTemplate(currentTemplate.id, {
          content: currentTemplate.content
        })
      }

      setCurrentTemplate({ 
        id: 0,
        content: ''
      })
      setShowModal(false)
      fetchTemplates() // Refresh the list
    } catch (error) {
      const errorMessage = handleApiError(error)
      setError(errorMessage)
      console.error("Error saving template:", error)
    } finally {
      setActionLoading(false)
    }
  }

  const handleEditTemplate = (template: RemarksTemplate) => {
    setModalMode('edit')
    setCurrentTemplate(template)
    setShowModal(true)
    setError(null)
  }

  const handleDeleteTemplate = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this template?')) return

    setActionLoading(true)
    try {
      await remarksTemplateApi.deleteTemplate(id)
      fetchTemplates()
    } catch (error) {
      const errorMessage = handleApiError(error)
      setError(errorMessage)
      console.error('Error deleting template:', error)
    } finally {
      setActionLoading(false)
    }
  }

  const handleAddNew = () => {
    setModalMode('add')
    setCurrentTemplate({ 
      id: 0,
      content: ''
    })
    setShowModal(true)
    setError(null)
  }

  // Client-side filtering for search with safety checks
  const filteredTemplates = templates.filter((template) => {
    const search = searchTerm.toLowerCase();
    return template.content?.toLowerCase().includes(search);
  })

  // Reset error when search changes
  useEffect(() => {
    if (error) setError(null)
  }, [searchTerm])

  return (
    <div className="container-fluid">
      {/* Error Alert */}
      {error && (
        <div className="alert alert-danger d-flex align-items-center p-5 mb-5">
          <i className="bi bi-exclamation-triangle fs-2hx me-4"></i>
          <div className="d-flex flex-column">
            <h4 className="mb-1 text-danger">Error</h4>
            <span>{error}</span>
          </div>
          <button 
            type="button" 
            className="btn-close ms-auto" 
            onClick={() => setError(null)}
          ></button>
        </div>
      )}

      {/* Card Container */}
      <div className="card">
        {/* Card Header */}
        <div className="card-header border-0 pt-6">
          <div className="card-title">
            <h3 className="fw-bold m-0">Remarks Templates</h3>
          </div>
          
          <div className="card-toolbar">
            <div className="d-flex align-items-center gap-4">
              {/* Search Input */}
              <div className="d-flex align-items-center position-relative">
                <i className="bi bi-search fs-4 position-absolute ms-3"></i>
                <input
                  type="text"
                  className="form-control form-control-solid w-250px ps-10"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Entries Selector */}
              <div className="d-flex align-items-center">
                <span className="text-gray-600 me-2">Show</span>
                <select
                  className="form-select form-select-solid w-auto"
                  value={entriesPerPage}
                  onChange={handleEntriesChange}
                  disabled={loading}
                >
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
                <span className="text-gray-600 ms-2">entries</span>
              </div>

              {/* Add Template Button */}
              <button
                onClick={handleAddNew}
                className="btn btn-primary d-flex align-items-center gap-2"
                disabled={loading || actionLoading}
              >
                {actionLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Loading...
                  </>
                ) : (
                  <>
                    <i className="bi bi-plus-circle"></i>
                    Add Remarks Template
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Card Body */}
        <div className="card-body p-0">
          {loading ? (
            <div className="text-center py-10">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2 text-muted">Loading templates...</p>
            </div>
          ) : (
            <RemarksTemplatesList
              templates={filteredTemplates}
              onEdit={handleEditTemplate}
              onDelete={handleDeleteTemplate}
            />
          )}
        </div>

        {/* Card Footer */}
        <div className="card-footer d-flex justify-content-between align-items-center py-3">
          <div className="text-gray-600">
            Showing {filteredTemplates.length} of {pagination.total_records} entries
            {searchTerm && ` (filtered from ${templates.length} entries on this page)`}
          </div>
          
          {/* Pagination */}
          {pagination.total_pages > 1 && (
            <nav>
              <ul className="pagination mb-0">
                <li className={`page-item ${pagination.current_page === 1 ? 'disabled' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(pagination.current_page - 1)}
                    disabled={pagination.current_page === 1 || loading}
                  >
                    Previous
                  </button>
                </li>

                {Array.from({ length: pagination.total_pages }, (_, i) => i + 1).map(page => (
                  <li
                    key={page}
                    className={`page-item ${pagination.current_page === page ? 'active' : ''}`}
                  >
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(page)}
                      disabled={loading}
                    >
                      {page}
                    </button>
                  </li>
                ))}

                <li className={`page-item ${pagination.current_page === pagination.total_pages ? 'disabled' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(pagination.current_page + 1)}
                    disabled={pagination.current_page === pagination.total_pages || loading}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-gray-500 mt-4">
        2025@ Arth Technology
      </div>

      {/* Modal */}
      <RemarkTemplateModal
        show={showModal}
        onClose={() => setShowModal(false)}
        mode={modalMode}
        template={currentTemplate}
        setTemplate={setCurrentTemplate}
        onSubmit={handleAddOrUpdateTemplate}
        loading={actionLoading}
      />
    </div>
  )
}

export default RemarksTemplatesMaster