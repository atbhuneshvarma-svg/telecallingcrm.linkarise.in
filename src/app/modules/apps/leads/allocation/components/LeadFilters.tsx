import React, { useState } from 'react'
import { CampaignFileModal } from './LeadImport'
import { Campaign } from '../core/_models'

interface LeadFiltersProps {
  campaigns: Campaign[]
  selectedCampaign: string
  setSelectedCampaign: React.Dispatch<React.SetStateAction<string>>
  searchTerm: string
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>
  selectedLeads: number[]
  setShowAllocateModal: React.Dispatch<React.SetStateAction<boolean>>
  setShowDeleteModal: React.Dispatch<React.SetStateAction<boolean>>
  setShowImportModal: React.Dispatch<React.SetStateAction<boolean>>
  showImportModal: boolean
  handleImport: (file: File, campaignmid: number) => Promise<void>
}

export const LeadFilters: React.FC<LeadFiltersProps> = ({
  campaigns,
  selectedCampaign,
  setSelectedCampaign,
  searchTerm,
  setSearchTerm,
  selectedLeads,
  setShowAllocateModal,
  setShowDeleteModal,
  setShowImportModal,
  showImportModal,
  handleImport,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [searchCampaign, setSearchCampaign] = useState('')
  const selectedCount = selectedLeads.length

  // ✅ Filter campaigns dynamically
  const filteredCampaigns = campaigns.filter((c) =>
    c.campaignname.toLowerCase().includes(searchCampaign.toLowerCase())
  )

  // ✅ File select handler
  const handleFileSelect = async (file: File, campaignId: number) => {
    if (!campaignId || campaignId === 0) {
      alert('Please select a campaign before importing leads.')
      return
    }

    console.log('✅ File selected for import:', file.name, 'Campaign ID:', campaignId)
    await handleImport(file, campaignId)
    setShowImportModal(false)
  }

  return (
    <>
      <div className="card shadow border-0">
        <div className="card-body">
          <div className="row g-3 align-items-center mb-3">
            {/* 🔍 Search */}
            <div className="col-md-3 col-sm-12">
              <label className="form-label fw-semibold">Search Leads</label>
              <input
                type="text"
                className="form-control"
                placeholder="Search by name, number, etc..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* 🎯 Campaign Sticky Dropdown */}
            <div className="col-md-4 col-sm-12 position-relative">
              <label className="form-label fw-semibold">Select Campaign</label>
              <div className="dropdown w-100">
                <button
                  className="btn btn-outline-secondary w-100 text-start d-flex justify-content-between align-items-center"
                  type="button"
                  onClick={() => setDropdownOpen((prev) => !prev)}
                  aria-expanded={dropdownOpen}
                >
                  <span>
                    {selectedCampaign === '0'
                      ? 'All Campaigns'
                      : campaigns.find((c) => c.campaignmid.toString() === selectedCampaign)?.campaignname || 'Select Campaign'}
                  </span>
                  <i className={`bi bi-chevron-${dropdownOpen ? 'up' : 'down'}`}></i>
                </button>

                {dropdownOpen && (
                  <div
                    className="dropdown-menu show w-100 p-0 mt-1 border"
                    style={{
                      maxHeight: 250,
                      overflowY: 'auto',
                      position: 'absolute',
                      zIndex: 1050,
                      borderRadius: '0.5rem',
                      boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                    }}
                  >
                    {/* 🧭 Sticky Header Inside Dropdown */}
                    <div
                      className="bg-light p-2 sticky-top border-bottom"
                      style={{ zIndex: 1060 }}
                    >
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        placeholder="Search campaigns..."
                        value={searchCampaign}
                        onChange={(e) => setSearchCampaign(e.target.value)}
                      />
                    </div>

                    <button
                      className={`dropdown-item ${selectedCampaign === '0' ? 'active' : ''}`}
                      onClick={() => {
                        setSelectedCampaign('0')
                        setDropdownOpen(false)
                      }}
                    >
                      All Campaigns
                    </button>

                    {filteredCampaigns.length > 0 ? (
                      filteredCampaigns.map((c) => (
                        <button
                          key={c.campaignmid}
                          className={`dropdown-item ${
                            selectedCampaign === c.campaignmid.toString() ? 'active' : ''
                          }`}
                          onClick={() => {
                            setSelectedCampaign(c.campaignmid.toString())
                            setDropdownOpen(false)
                          }}
                        >
                          {c.campaignname}
                        </button>
                      ))
                    ) : (
                      <div className="dropdown-item text-muted small text-center">
                        No campaigns found
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* ⚙️ Actions */}
            <div className="col-md-5 col-sm-12 d-flex align-items-end gap-2 justify-content-md-end justify-content-start">
              {/* Allocate Button - Green */}
              <button
                type="button"
                className="btn btn-success"
                onClick={() => setShowAllocateModal(true)}
                disabled={selectedCount === 0}
              >
                <i className="bi bi-person-check me-1"></i>
                Allocate{selectedCount ? ` (${selectedCount})` : ''}
              </button>

              {/* Delete Button - Red */}
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => setShowDeleteModal(true)}
                disabled={selectedCount === 0}
              >
                <i className="bi bi-trash me-1"></i>
                Delete{selectedCount ? ` (${selectedCount})` : ''}
              </button>
            </div>
          </div>

          {/* Summary */}
          <div className="border-top pt-3 mt-2">
            <p className="text-muted small mb-0">
              Showing: <strong>{searchTerm || 'All Leads'}</strong>
            </p>
          </div>
        </div>
      </div>

      {/* 📂 Import Modal */}
      <CampaignFileModal
        show={showImportModal}
        onFileSelect={handleFileSelect}
        onClose={() => setShowImportModal(false)}
      />
    </>
  )
}

export default LeadFilters