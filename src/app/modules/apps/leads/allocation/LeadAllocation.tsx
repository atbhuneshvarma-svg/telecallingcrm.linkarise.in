import React, { useState, useMemo } from 'react'
import { LeadFilters } from './components/LeadFilters'
import LeadTable from './components/LeadTable'
import AllocateModal from './components/AllocateModal'
import DeleteModal from './components/DeleteModal'
import { CampaignFileModal } from './components/LeadImport'
import { useLeadAllocation } from './hooks/useLeadAllocation'
import { Lead, Campaign } from './core/_models'
import BulkAllocateModal from './components/BulkAllocateModal'
import { ImportResultsModal } from './components/ImportResultsModal'
import { useNavigate } from 'react-router-dom'

// ✅ Add interface for import results
interface ImportResults {
  imported: number;
  duplicates: Array<{
    row: number;
    email: string;
    phone: string;
    message: string;
  }>;
  errors: Array<{
    row: number;
    field?: string;
    message: string;
  }>;
  success?: boolean;
  message?: string;
}

const LeadAllocation: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCampaign, setSelectedCampaign] = useState<string>('0')
  const [showAllocateModal, setShowAllocateModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [assignTo, setAssignTo] = useState('')
  const [showImportModal, setShowImportModal] = useState(false)
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false)
  
  // ✅ Add state for import results
  const [importResults, setImportResults] = useState<ImportResults | null>(null)
  const [showImportResults, setShowImportResults] = useState(false)
  const [isImporting, setIsImporting] = useState(false)

  // ✅ Add navigate hook for transfer functionality
  const navigate = useNavigate()

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
    fetchBulkAllocationData,
    bulkAllocateLeads,
    deleteLeads,
    handleImport,
    refreshData,
    importLeads
  } = useLeadAllocation()

  // ✅ Simple transfer leads handler - just redirects
  const handleTransferLeads = () => {
    navigate('transfer') // Adjust path to match your existing route
  }

  // ✅ Updated import handler that captures results
  const handleImportWithResults = async (file: File, campaignmid: number) => {
    setIsImporting(true)
    setShowImportModal(false) // Close import modal
    
    try {
      console.log("🔄 Starting import...")
      
      // Use importLeads directly to get the detailed response
      const result = await importLeads(file, campaignmid)
      console.log("📊 Import result:", result)
      
      // Store the results and show modal
      setImportResults(result)
      setShowImportResults(true)
      
      // Refresh the data
      await refreshData()
      
    } catch (error) {
      console.error("❌ Import failed:", error)
    } finally {
      setIsImporting(false)
    }
  }

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

  // ✅ Bulk allocation handler
  const handleBulkAllocate = async (campaignId: number, userIds: number[]) => {
    try {
      await bulkAllocateLeads(campaignId, userIds)
      setIsBulkModalOpen(false)
    } catch (error) {
      console.error('Error in bulk allocation:', error)
    }
  }

  // ✅ Fetch bulk allocation data when opening modal
  const handleOpenBulkModal = async () => {
    try {
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
        lead.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
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

  console.log("hello",leads);
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
              <h1 className="h4 fw-bold text-dark mb-1">Lead Allocation</h1>
              <p className="text-muted mb-0">
                {selectedLeads.length > 0 && (
                  <span className="badge bg-primary">
                    {selectedLeads.length} lead(s) selected
                  </span>
                )}
              </p>
            </div>
          </div>
          
          {/* ✅ Action Buttons Group - Bulk Allocate, Import Leads & Transfer Leads */}
          <div className="btn-group mt-2">
            <button
              className="btn btn-primary"
              onClick={handleOpenBulkModal}
              disabled={loading}
            >
              <i className="fas fa-users me-2"></i>
              Bulk Allocate
            </button>
            <button
              className="btn btn-outline-primary"
              onClick={() => setShowImportModal(true)}
              disabled={loading || isImporting}
            >
              {isImporting ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Importing...
                </>
              ) : (
                <>
                  <i className="fas fa-file-import me-2"></i>
                  Import Leads
                </>
              )}
            </button>
            {/* ✅ Transfer Leads Button - Simple redirect */}
            <button
              className="btn btn-outline-info"
              onClick={handleTransferLeads}
              disabled={loading}
            >
              <i className="fas fa-exchange-alt me-2"></i>
              Transfer Leads
            </button>
            <button
              className="btn btn-outline-secondary"
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
                <>
                  <i className="fas fa-refresh me-2"></i>
                  Refresh
                </>
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
        handleImport={handleImportWithResults}
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
        onFileSelect={handleImportWithResults}
        onClose={() => setShowImportModal(false)}
      />

      {/* ✅ Bulk Allocate Modal */}
      <BulkAllocateModal
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
        onSubmit={handleBulkAllocate}
        users={users}
        campaigns={leadCampaigns}
        loading={loading}
      />

      {/* ✅ Import Results Modal */}
      <ImportResultsModal
        show={showImportResults}
        onClose={() => {
          setShowImportResults(false)
          setImportResults(null)
        }}
        results={importResults}
      />
    </div>
  )
}

export default LeadAllocation