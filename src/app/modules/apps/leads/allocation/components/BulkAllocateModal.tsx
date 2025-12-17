// src/app/modules/apps/leads/allocation/components/BulkAllocateModal.tsx
import React, { useState, useEffect, useMemo } from 'react'

interface User {
  usermid: number
  username: string
  useremail: string
  usermobile: string | null
  userrole?: string
}

interface Campaign {
  campaignmid: number
  campaignname: string
}

interface Props {
  isOpen: boolean
  onClose: () => void
  onSubmit: (campaignId: number, selectedUserIds: number[]) => void
  users: User[]
  campaigns: Campaign[]
  loading?: boolean
}

const BulkAllocateModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSubmit,
  users,
  campaigns,
  loading = false
}) => {
  const [selectedCampaign, setSelectedCampaign] = useState<number>(0)
  const [selectedUsers, setSelectedUsers] = useState<number[]>([])
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const itemsPerPage = 10

  // Memoized filtered users for better performance
  const filteredUsers = useMemo(() => 
    users.filter(user =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.useremail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.usermobile && user.usermobile.includes(searchTerm))
    ),
    [users, searchTerm]
  )

  // Memoized pagination data
  const paginationData = useMemo(() => {
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage)
    
    return { totalPages, startIndex, paginatedUsers }
  }, [filteredUsers, currentPage, itemsPerPage])

  const { totalPages, startIndex, paginatedUsers } = paginationData

  const toggleUserSelection = (userId: number) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    )
  }

  const toggleSelectAll = () => {
    if (selectedUsers.length === paginatedUsers.length) {
      setSelectedUsers([])
    } else {
      const pageUserIds = paginatedUsers.map(user => user.usermid)
      setSelectedUsers(pageUserIds)
    }
  }

  const handleSubmit = () => {
    if (!selectedCampaign) {
      alert('Please select a campaign')
      return
    }
    
    if (selectedUsers.length === 0) {
      alert('Please select at least one telecaller')
      return
    }

    onSubmit(selectedCampaign, selectedUsers)
  }

  const handleClose = () => {
    setSelectedCampaign(0)
    setSelectedUsers([])
    setCurrentPage(1)
    setSearchTerm('')
    onClose()
  }

  // Reset when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedCampaign(0)
      setSelectedUsers([])
      setCurrentPage(1)
      setSearchTerm('')
    }
  }, [isOpen])

  // Auto-focus search input when modal opens
  useEffect(() => {
    if (isOpen) {
      const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement
      if (searchInput) {
        setTimeout(() => searchInput.focus(), 100)
      }
    }
  }, [isOpen])

  // Generate pagination buttons with limits for many pages
  const renderPaginationButtons = () => {
    const buttons = []
    const maxVisiblePages = 5
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)
    
    // Adjust start page if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }

    // First page
    if (startPage > 1) {
      buttons.push(
        <li key={1} className={`page-item ${currentPage === 1 ? 'active' : ''}`}>
          <button className="page-link" onClick={() => setCurrentPage(1)}>1</button>
        </li>
      )
      if (startPage > 2) {
        buttons.push(
          <li key="ellipsis1" className="page-item disabled">
            <span className="page-link">...</span>
          </li>
        )
      }
    }

    // Page numbers
    for (let page = startPage; page <= endPage; page++) {
      buttons.push(
        <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
          <button className="page-link" onClick={() => setCurrentPage(page)}>
            {page}
          </button>
        </li>
      )
    }

    // Last page
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        buttons.push(
          <li key="ellipsis2" className="page-item disabled">
            <span className="page-link">...</span>
          </li>
        )
      }
      buttons.push(
        <li key={totalPages} className={`page-item ${currentPage === totalPages ? 'active' : ''}`}>
          <button className="page-link" onClick={() => setCurrentPage(totalPages)}>
            {totalPages}
          </button>
        </li>
      )
    }

    return buttons
  }

  if (!isOpen) return null

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-xl">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Bulk Lead Allocation</h5>
            <button 
              type="button" 
              className="btn-close" 
              onClick={handleClose}
              disabled={loading}
              aria-label="Close"
            ></button>
          </div>

          <div className="modal-body">
            {/* Campaign Selection */}
            <div className="row mb-4">
              <div className="col-md-12">
                <label htmlFor="campaignSelect" className="form-label fw-semibold">
                  Select Campaign <span className="text-danger">*</span>
                </label>
                <select
                  id="campaignSelect"
                  className={`form-select ${!selectedCampaign ? 'is-invalid' : ''}`}
                  value={selectedCampaign}
                  onChange={(e) => setSelectedCampaign(Number(e.target.value))}
                  disabled={loading}
                >
                  <option value={0}>Select Campaign</option>
                  {campaigns.map(campaign => (
                    <option key={campaign.campaignmid} value={campaign.campaignmid}>
                      {campaign.campaignname}
                    </option>
                  ))}
                </select>
                {!selectedCampaign && (
                  <div className="text-danger small mt-1">Please select a campaign</div>
                )}
                {campaigns.length === 0 && (
                  <div className="text-warning small mt-1">No campaigns available for allocation</div>
                )}
                <div className="text-muted small mt-1">
                  Leads from the selected campaign will be equally distributed among the selected telecallers
                </div>
              </div>
            </div>

            {/* Users Table */}
            <div className="card">
              <div className="card-header">
                <div className="row align-items-center">
                  <div className="col-md-6">
                    <h6 className="mb-0">Select Telecallers</h6>
                    <small className="text-muted">
                      {users.length} telecallers available • {selectedUsers.length} selected
                    </small>
                  </div>
                  <div className="col-md-6">
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search by name, email, or mobile..."
                        value={searchTerm}
                        onChange={(e) => {
                          setSearchTerm(e.target.value)
                          setCurrentPage(1)
                        }}
                        disabled={loading}
                      />
                      <span className="input-group-text">
                        <i className="fas fa-search"></i>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover table-striped table-sm mb-0 align-middle">
                    <thead className="table-light">
                      <tr>
                        <th style={{ width: '50px' }}>
                          <input
                            type="checkbox"
                            className="form-check-input"
                            checked={paginatedUsers.length > 0 && selectedUsers.length === paginatedUsers.length}
                            onChange={toggleSelectAll}
                            disabled={loading || paginatedUsers.length === 0}
                            aria-label="Select all users on this page"
                          />
                        </th>
                        <th style={{ width: '70px' }}>#</th>
                        <th>Telecaller</th>
                        <th style={{ width: '120px' }}>Mobile</th>
                        <th style={{ width: '200px' }}>Email</th>
                        <th style={{ width: '100px' }}>Role</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedUsers.length > 0 ? (
                        paginatedUsers.map((user, index) => (
                          <tr 
                            key={user.usermid} 
                            className={selectedUsers.includes(user.usermid) ? 'table-primary' : ''}
                            style={{ cursor: 'pointer' }}
                            onClick={() => !loading && toggleUserSelection(user.usermid)}
                          >
                            <td onClick={(e) => e.stopPropagation()}>
                              <input
                                type="checkbox"
                                className="form-check-input"
                                checked={selectedUsers.includes(user.usermid)}
                                onChange={() => toggleUserSelection(user.usermid)}
                                disabled={loading}
                                aria-label={`Select ${user.username}`}
                              />
                            </td>
                            <td className="fw-semibold text-center">{startIndex + index + 1}</td>
                            <td>
                              <div className="d-flex align-items-center">
                                <div 
                                  className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-2"
                                  style={{width: '32px', height: '32px', fontSize: '12px'}}
                                >
                                  {user.username.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <div className="fw-semibold">
                                    {user.username}
                                  </div>
                                  <small className="text-muted">{user.useremail}</small>
                                </div>
                              </div>
                            </td>
                            <td>
                              {user.usermobile ? (
                                <a href={`tel:${user.usermobile}`} className="text-decoration-none">
                                  {user.usermobile}
                                </a>
                              ) : (
                                <span className="text-muted">-</span>
                              )}
                            </td>
                            <td>
                              <a href={`mailto:${user.useremail}`} className="text-decoration-none text-truncate d-block">
                                {user.useremail}
                              </a>
                            </td>
                            <td>
                              <span className={`badge ${user.userrole ? 'bg-info' : 'bg-secondary'}`}>
                                {user.userrole || 'No Role'}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="text-center py-4 text-muted">
                            <i className="fas fa-users fa-2x mb-3 d-block"></i>
                            {searchTerm ? 'No telecallers found matching your search' : 'No telecallers available'}
                            {searchTerm && (
                              <div className="mt-1">
                                <small>Try adjusting your search terms</small>
                              </div>
                            )}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="card-footer">
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="text-muted">
                      Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredUsers.length)} of {filteredUsers.length} records
                    </div>
                    <nav>
                      <ul className="pagination mb-0">
                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                          <button
                            className="page-link"
                            onClick={() => setCurrentPage(currentPage - 1)}
                            disabled={currentPage === 1}
                          >
                            &laquo; Previous
                          </button>
                        </li>
                        {renderPaginationButtons()}
                        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                          <button
                            className="page-link"
                            onClick={() => setCurrentPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                          >
                            Next &raquo;
                          </button>
                        </li>
                      </ul>
                    </nav>
                  </div>
                </div>
              )}
            </div>

            {/* Selection Summary */}
            {selectedUsers.length > 0 && (
              <div className="alert alert-info mt-3 mb-0">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <i className="fas fa-info-circle me-2"></i>
                    <strong>{selectedUsers.length}</strong> telecaller(s) selected for allocation
                    <div className="small mt-1">
                      Leads will be equally distributed among all selected telecallers
                    </div>
                  </div>
                  <div>
                    <button 
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => setSelectedUsers([])}
                      disabled={loading}
                    >
                      Clear Selection
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="button" 
              className="btn btn-primary" 
              onClick={handleSubmit}
              disabled={!selectedCampaign || selectedUsers.length === 0 || loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  Allocating Leads...
                </>
              ) : (
                `Allocate Leads to ${selectedUsers.length} Telecaller${selectedUsers.length !== 1 ? 's' : ''}`
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BulkAllocateModal