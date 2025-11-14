// WhatsAppTemplatesMaster.tsx
import React, { useEffect, useState } from 'react'
import WhatsAppTemplateModal from './WhatsAppTemplateModal'
import WhatsAppTemplatesList from './WhatsAppTemplatesList'
import { whatsAppTemplateApi } from './core/_requests'
import { WhatsAppTemplate, PaginationInfo } from './core/_models'

const WhatsAppTemplatesMaster = () => {
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
  const [templates, setTemplates] = useState<WhatsAppTemplate[]>([])
  const [currentTemplate, setCurrentTemplate] = useState<WhatsAppTemplate>({ 
    id: 0,
    name: '',
    category: 'UTILITY',
    language: 'en',
    status: 'PENDING',
    header_type: 'TEXT',
    header_text: '',
    body: '',
    footer: '',
    buttons: []
  })
  const [loading, setLoading] = useState(false)

  // Fetch templates when page or entries per page changes
  useEffect(() => {
    fetchTemplates()
  }, [currentPage, entriesPerPage])

  const fetchTemplates = async () => {
    setLoading(true)
    try {
      console.log('Fetching templates with page:', currentPage, 'per page:', entriesPerPage);
      const response = await whatsAppTemplateApi.getTemplatesPaginated(currentPage, entriesPerPage)
      console.log('Templates API response:', response);

      setTemplates(response.data)
      setPagination({
        current_page: response.current_page,
        per_page: response.per_page,
        total_records: response.total_records,
        total_pages: response.total_pages
      })
    } catch (error) {
      console.error('Error fetching templates:', error)
      setTemplates([])
    } finally {
      setLoading(false)
    }
  }

  const handleEntriesChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newPerPage = Number(e.target.value)
    setEntriesPerPage(newPerPage)
    setCurrentPage(1) // Reset to first page when changing entries per page
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleAddOrUpdateTemplate = async () => {
    if (!currentTemplate.name.trim() || !currentTemplate.body.trim()) return;

    try {
      if (modalMode === "add") {
        await whatsAppTemplateApi.createTemplate({
          name: currentTemplate.name,
          category: currentTemplate.category,
          language: currentTemplate.language,
          status: currentTemplate.status,
          header_type: currentTemplate.header_type,
          header_text: currentTemplate.header_text,
          body: currentTemplate.body,
          footer: currentTemplate.footer,
          buttons: currentTemplate.buttons
        });
        // Refresh the list to get updated pagination
        fetchTemplates();
      } else {
        await whatsAppTemplateApi.updateTemplate(currentTemplate.id, {
          name: currentTemplate.name,
          category: currentTemplate.category,
          language: currentTemplate.language,
          status: currentTemplate.status,
          header_type: currentTemplate.header_type,
          header_text: currentTemplate.header_text,
          body: currentTemplate.body,
          footer: currentTemplate.footer,
          buttons: currentTemplate.buttons
        });
        // Refresh to ensure data consistency
        fetchTemplates();
      }

      setCurrentTemplate({ 
        id: 0,
        name: '',
        category: 'UTILITY',
        language: 'en',
        status: 'PENDING',
        header_type: 'TEXT',
        header_text: '',
        body: '',
        footer: '',
        buttons: []
      });
      setShowModal(false);
    } catch (error) {
      console.error("Error saving template:", error);
    }
  };

  const handleEditTemplate = (template: WhatsAppTemplate) => {
    setModalMode('edit')
    setCurrentTemplate(template)
    setShowModal(true)
  }

  const handleDeleteTemplate = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this template?')) return

    try {
      await whatsAppTemplateApi.deleteTemplate(id)
      // Refresh to update pagination
      fetchTemplates();
    } catch (error) {
      console.error('Error deleting template:', error)
    }
  }

  const handleAddNew = () => {
    setModalMode('add')
    setCurrentTemplate({ 
      id: 0,
      name: '',
      category: 'UTILITY',
      language: 'en',
      status: 'PENDING',
      header_type: 'TEXT',
      header_text: '',
      body: '',
      footer: '',
      buttons: []
    })
    setShowModal(true)
  }

  // Client-side filtering for search (only filters the current page)
  const filteredTemplates = Array.isArray(templates)
    ? templates.filter((template) =>
        template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.body.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : []

  const displayedTemplates = Array.isArray(filteredTemplates)
    ? filteredTemplates
    : []

  return (
    <div className="container-fluid">
      {/* Card Container */}
      <div className="card">
        {/* Card Header */}
        <div className="card-header border-0 pt-6">
          <div className="card-title">
            <h3 className="fw-bold m-0">Whatsapp Templates</h3>
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
              >
                <i className="bi bi-plus-circle"></i>
                Add Template
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
            <WhatsAppTemplatesList
              templates={displayedTemplates}
              onEdit={handleEditTemplate}
              onDelete={handleDeleteTemplate}
            />
          )}
        </div>

        {/* Card Footer */}
        <div className="card-footer d-flex justify-content-between align-items-center py-3">
          <div className="text-gray-600">
            Showing {displayedTemplates.length} of {pagination.total_records} entries
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
                    disabled={pagination.current_page === 1}
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
                    >
                      {page}
                    </button>
                  </li>
                ))}

                <li className={`page-item ${pagination.current_page === pagination.total_pages ? 'disabled' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(pagination.current_page + 1)}
                    disabled={pagination.current_page === pagination.total_pages}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </div>
      </div>

      {/* Modal */}
      <WhatsAppTemplateModal
        show={showModal}
        onClose={() => setShowModal(false)}
        mode={modalMode}
        template={currentTemplate}
        setTemplate={setCurrentTemplate}
        onSubmit={handleAddOrUpdateTemplate}
      />
    </div>
  )
}

export default WhatsAppTemplatesMaster