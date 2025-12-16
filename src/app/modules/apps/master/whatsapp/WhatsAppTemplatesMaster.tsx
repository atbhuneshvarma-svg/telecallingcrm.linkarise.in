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
    template_name: '',
    message: '',
    type: 'Text'
  })
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
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

  const handleImageUpload = (file: File) => {
    setSelectedImage(file)

    // Create preview URL
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result as string)
    }
    reader.readAsDataURL(file)

    // Clear image preview when modal closes
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview)
      }
    }
  }

  const handleClearImage = () => {
    setSelectedImage(null)
    setImagePreview(null)
    setCurrentTemplate(prev => ({
      ...prev,
      whatsappimage: '',
      image_url: ''
    }))
  }

const handleAddOrUpdateTemplate = async () => {
  if (!currentTemplate.template_name?.trim()) {
    alert('Template Name is required')
    return
  }

  if (!currentTemplate.message?.trim()) {
    alert('Message is required')
    return
  }

  try {
    // Create FormData to send both form data and file
    const formData = new FormData()

    // Add text fields
    formData.append('template_name', currentTemplate.template_name)
    formData.append('message', currentTemplate.message)
    formData.append('type', currentTemplate.type || 'Text')

    // Add company ID (from your API response)
    formData.append('cmpmid', '15')

    // Add image if exists
    if (selectedImage) {
      formData.append('whatsappimage', selectedImage)
    } else if (currentTemplate.type === 'ImageText' && !selectedImage && modalMode === 'add') {
      alert('Please upload an image for ImageText template')
      return
    }

    // For edit mode, add the template ID
    if (modalMode === 'edit' && currentTemplate.wtmid) {
      formData.append('wtmid', currentTemplate.wtmid.toString())
    }

    // Call appropriate API based on mode
    if (modalMode === 'add') {
      await whatsAppTemplateApi.createTemplate(formData)
    } else {
      await whatsAppTemplateApi.updateTemplate(currentTemplate.wtmid!, formData)
    }

    // Refresh the list
    fetchTemplates()

    // Reset and close modal
    setCurrentTemplate({
      template_name: '',
      message: '',
      type: 'Text'
    })
    setSelectedImage(null)
    setImagePreview(null)
    setShowModal(false)
  } catch (error: any) {
    console.error("Error saving template:", error)
    // Show more specific error message
    alert(`Failed to save template: ${error.message || 'Unknown error'}`)
  }
}
  const handleEditTemplate = (template: WhatsAppTemplate) => {
    setModalMode('edit')
    setCurrentTemplate({
      wtmid: template.wtmid,
      template_name: template.template_name || template.name || '',
      message: template.message || template.body || '',
      whatsappimage: template.whatsappimage || '',
      type: template.type || 'Text',
      image_url: template.image_url || ''
    })
    setSelectedImage(null)
    setImagePreview(template.image_url || null)
    setShowModal(true)
  }

  const handleDeleteTemplate = async (wtmid: number) => {
    if (!window.confirm('Are you sure you want to delete this template?')) return

    try {
      await whatsAppTemplateApi.deleteTemplate(wtmid)
      // Refresh to update pagination
      fetchTemplates()
    } catch (error) {
      console.error('Error deleting template:', error)
      alert('Failed to delete template. Please try again.')
    }
  }

  const handleAddNew = () => {
    setModalMode('add')
    setCurrentTemplate({
      template_name: '',
      message: '',
      type: 'Text'
    })
    setSelectedImage(null)
    setImagePreview(null)
    setShowModal(true)
  }

  // Client-side filtering for search
  const filteredTemplates = templates.filter((template) => {
    const searchTermLower = searchTerm.toLowerCase()
    const templateName = (template.template_name || template.name || '').toLowerCase()
    const message = (template.message || template.body || '').toLowerCase()
    const type = (template.type || '').toLowerCase()

    return templateName.includes(searchTermLower) ||
      message.includes(searchTermLower) ||
      type.includes(searchTermLower)
  })

  return (
    <div className="container-fluid">
      {/* Card Container */}
      <div className="card">
        {/* Card Header */}
        <div className="card-header border-0 pt-6">
          <div className="card-title">
            <h1 className="fw-bold text-gray-800">WhatsApp Templates</h1>
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
                className="btn btn-sm btn-primary d-flex align-items-center gap-2"
           style={{width:'150px' , height:'35px'}}
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
              templates={filteredTemplates}
              onEdit={handleEditTemplate}
              onDelete={handleDeleteTemplate}
            />
          )}
        </div>

        {/* Card Footer */}
        <div className="card-footer d-flex justify-content-between align-items-center py-3">
          <div className="text-gray-600">
            Showing {filteredTemplates.length} of {templates.length} entries on this page
            {searchTerm && ` (filtered from ${templates.length} total)`}
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
        onImageUpload={handleImageUpload}
        onClearImage={handleClearImage}
        selectedImage={selectedImage}
        imagePreview={imagePreview || currentTemplate.image_url}
      />
    </div>
  )
}

export default WhatsAppTemplatesMaster