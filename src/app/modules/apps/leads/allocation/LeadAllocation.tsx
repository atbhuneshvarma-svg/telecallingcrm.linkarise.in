import React, { useState, useMemo } from 'react'
import { LeadFilters } from './components/LeadFilters'
import LeadTable from './components/LeadTable'
import AllocateModal from './components/AllocateModal'
import DeleteModal from './components/DeleteModal'
import { CampaignFileModal } from './components/LeadImport'
import { useLeadAllocation } from './hooks/useLeadAllocation'
import { Lead, Campaign } from './core/_models'
import BulkAllocateModal from './components/BulkAllocateModal'

const LeadAllocation: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCampaign, setSelectedCampaign] = useState<string>('0')
  const [showAllocateModal, setShowAllocateModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [assignTo, setAssignTo] = useState('')
  const [showImportModal, setShowImportModal] = useState(false)
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false)

  const {
    leads,
    loading,
    selectedLeads,
    users,
    campaigns,
    allSelected,
    selectAllLeads,
    toggleLeadSelection,
    allocateLeads,
    fetchBulkAllocationData, // ✅ Add this from hook
    bulkAllocateLeads, // ✅ Add this from hook
    deleteLeads,
    handleImport,
    refreshData,
  } = useLeadAllocation()

  // ✅ Allocate handler
  const handleAllocate = async () => {
    if (!assignTo) {
      alert('Please select a user to assign leads to')
      return
    }
    try {
      await allocateLeads(Number(assignTo))
      setShowAllocateModal(false)
      setAssignTo('')
    } catch (error) {
      console.error('Allocation failed:', error)
    }
  }

  // ✅ Delete handler
  const handleDelete = async () => {
    try {
      await deleteLeads()
      setShowDeleteModal(false)
    } catch (error) {
      console.error('Delete failed:', error)
    }
  }

  // ✅ UPDATED: Bulk allocation handler
  const handleBulkAllocate = async (campaignId: number, userIds: number[]) => {
    try {
      // Use the bulkAllocateLeads function from the hook
      await bulkAllocateLeads(campaignId, userIds)
      setIsBulkModalOpen(false)
    } catch (error) {
      console.error('Error in bulk allocation:', error)
    }
  }

  // ✅ Fetch bulk allocation data when opening modal
  const handleOpenBulkModal = async () => {
    try {
      // Fetch fresh data for bulk allocation
      await fetchBulkAllocationData()
      setIsBulkModalOpen(true)
    } catch (error) {
      console.error('Error fetching bulk allocation data:', error)
    }
  }

  // ✅ Filter leads
  const filteredLeads = useMemo(() => {
    return leads.filter((lead: Lead) => {
      const matchesSearch =
        searchTerm === '' ||
        lead.leadname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.phone?.includes(searchTerm)

      const matchesCampaign =
        selectedCampaign === '0' ||
        lead.campaign?.campaignmid === Number(selectedCampaign)

      return matchesSearch && matchesCampaign
    })
  }, [leads, searchTerm, selectedCampaign])

  // ✅ Unique campaigns for filters
  const campaignOptions: Campaign[] = useMemo(() => {
    const uniqueCampaigns = [
      ...new Map(
        campaigns
          .filter((campaign) => campaign)
          .map((campaign) => [campaign.campaignmid, campaign])
      ).values(),
    ]
    return uniqueCampaigns
  }, [campaigns])

  // ✅ Get unique campaigns from leads for bulk allocation modal
  const leadCampaigns: Campaign[] = useMemo(() => {
    const campaignsFromLeads = leads
      .map(lead => lead.campaign)
      .filter((campaign): campaign is Campaign => campaign !== undefined)

    return [
      ...new Map(
        campaignsFromLeads.map(campaign => [campaign.campaignmid, campaign])
      ).values(),
    ]
  }, [leads])

  return (
    <div className="container-fluid py-4">
      <div className="card shadow-sm mb-4">
        <div className="card-header bg-transparent py-3">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="h4 fw-bold text-dark mb-1">Lead Master</h1>
              <p className="text-muted mb-0">
                Total: {leads.length} • Showing: {filteredLeads.length} • Selected: {selectedLeads.length}
              </p>
            </div>

          </div>
           <div className="btn-group">
              <button
                className="btn btn-primary"
                onClick={handleOpenBulkModal} // ✅ Use the proper handler
                disabled={loading}
              >
                <i className="fas fa-users me-2"></i>
                Bulk Allocate
              </button>
              <button
                className="btn btn-outline-primary btn-md"
                onClick={refreshData}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Loading...
                  </>
                ) : (
                  'Refresh'
                )}
              </button>
            </div>
        </div>
      </div>

      {/* ✅ Filters */}
      <LeadFilters
        campaigns={campaignOptions}
        selectedCampaign={selectedCampaign}
        setSelectedCampaign={setSelectedCampaign}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedLeads={selectedLeads}
        setShowAllocateModal={setShowAllocateModal}
        setShowDeleteModal={setShowDeleteModal}
        setShowImportModal={setShowImportModal}
        showImportModal={showImportModal}
        handleImport={handleImport}
      />

      {/* ✅ Table */}
      <LeadTable
        leads={filteredLeads}
        loading={loading}
        selectedLeads={selectedLeads}
        allSelected={allSelected}
        toggleLeadSelection={toggleLeadSelection}
        selectAllLeads={selectAllLeads}
      />

      {/* ✅ Allocate Modal */}
      {showAllocateModal && (
        <AllocateModal
          users={users}
          selectedLeads={selectedLeads}
          assignTo={assignTo}
          setAssignTo={setAssignTo}
          handleAllocate={handleAllocate}
          onClose={() => setShowAllocateModal(false)}
          loading={loading}
        />
      )}

      {/* ✅ Delete Modal */}
      {showDeleteModal && (
        <DeleteModal
          selectedLeads={selectedLeads}
          handleDelete={handleDelete}
          onClose={() => setShowDeleteModal(false)}
          loading={loading}
        />
      )}

      {/* ✅ Import Modal */}
      <CampaignFileModal
        show={showImportModal}
        onFileSelect={handleImport}
        onClose={() => setShowImportModal(false)}
      />

      {/* ✅ Bulk Allocate Modal */}
      <BulkAllocateModal
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
        onSubmit={handleBulkAllocate}
        users={users}
        campaigns={leadCampaigns} // ✅ Use campaigns from leads
        loading={loading} // ✅ Use main loading state
      />
    </div>
  )
}

export default LeadAllocation