import { useEffect, useState, useCallback } from "react"
import axios from "axios"
import { Lead as LeadModel, Campaign, User, LeadAllocationResponse } from "../core/_models"
import { toast } from "react-toastify"

// ✅ Import Response Interface
interface ImportLeadsResponse {
  success: boolean
  imported: number
  duplicates: Array<{
    row: number
    email: string
    phone: string
    message: string
  }>
  errors: Array<{
    row: number
    field?: string
    message: string
  }>
  message?: string
}

// ✅ Bulk Allocation Interfaces
interface BulkAllocateData {
  campaigns: Campaign[]
  users: {
    current_page: number
    data: User[]
    first_page_url: string
    from: number
    last_page: number
    last_page_url: string
    links: Array<{
      url: string | null
      label: string
      active: boolean
    }>
    next_page_url: string | null
    path: string
    per_page: number
    prev_page_url: string | null
    to: number
    total: number
  }
  leadids: number[]
}

interface BulkAllocateGetResponse {
  success: boolean
  data: BulkAllocateData
}

interface BulkAllocatePostRequest {
    campaignmid: number;
    lead_ids: string;    
    user_ids: number[];  
}

interface BulkAllocatePostResponse {
  success: boolean
  message: string
  data?: any
}

export interface UseLeadAllocationReturn {
  leads: LeadModel[]
  campaigns: Campaign[]
  users: User[]
  loading: boolean
  currentPage: number
  totalPages: number
  perPage: number
  total: number

  selectedLeads: number[]
  allSelected: boolean
  selectAllLeads: (select?: boolean) => void
  toggleLeadSelection: (leadId: number) => void

  allocateLeads: (assignToUserId: number) => Promise<void>
  deleteLeads: () => Promise<void>
  importLeads: (file: File, campaignmid: number) => Promise<ImportLeadsResponse>
  handleImport: (file: File, campaignmid: number) => Promise<void>
  
  // ✅ Bulk Allocation Functions
  fetchBulkAllocationData: () => Promise<BulkAllocateGetResponse>
  bulkAllocateLeads: (campaignId: number, userIds: number[]) => Promise<BulkAllocatePostResponse>

  fetchLeads: (page?: number) => Promise<void>
  refreshData: () => Promise<void>
}

export const useLeadAllocation = (): UseLeadAllocationReturn => {
  const API_URL = import.meta.env.VITE_APP_THEME_API_URL
  const [leads, setLeads] = useState<LeadModel[]>([])
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [total, setTotal] = useState(0)
  const [selectedLeads, setSelectedLeads] = useState<number[]>([])
  const [allSelected, setAllSelected] = useState(false)

  const fetchLeads = useCallback(async (page = 1) => {
    setLoading(true)
    try {
      const { data } = await axios.get<LeadAllocationResponse>(
        `${API_URL}/leadallocation?page=${page}`
      )

      if (data?.success && data.data) {
        const leadsData = data.data.leads
        setLeads(leadsData.data)
        setCampaigns(data.data.campaigns || [])
        setUsers(data.data.users || [])
        setCurrentPage(leadsData.current_page)
        setTotalPages(leadsData.last_page)
        setPerPage(leadsData.per_page)
        setTotal(leadsData.total)
        setSelectedLeads([])
        setAllSelected(false)
      }
    } catch (err) {
      console.error("Error fetching lead allocation data:", err)
      toast.error("Failed to load leads")
    } finally {
      setLoading(false)
    }
  }, [API_URL])

  useEffect(() => {
    fetchLeads()
  }, [fetchLeads])

  const refreshData = useCallback(async () => {
    await fetchLeads(currentPage)
  }, [fetchLeads, currentPage])

  const selectAllLeads = (select: boolean = true) => {
    if (select) {
      const ids = leads.map((l) => l.leadmid)
      setSelectedLeads(ids)
      setAllSelected(true)
    } else {
      setSelectedLeads([])
      setAllSelected(false)
    }
  }

  const toggleLeadSelection = (leadId: number) => {
    setSelectedLeads((prev) => {
      if (prev.includes(leadId)) {
        const next = prev.filter((id) => id !== leadId)
        setAllSelected(false)
        return next
      } else {
        const next = [...prev, leadId]
        if (next.length === leads.length) setAllSelected(true)
        return next
      }
    })
  }

  // ✅ Allocate leads to single user
  const allocateLeads = async (assignToUserId: number) => {
    if (selectedLeads.length === 0) throw new Error("No leads selected")
    setLoading(true)
    try {
      const payload = {
        lead_ids: selectedLeads.join(","),
        user_id: assignToUserId,
      }

      await axios.post(`${API_URL}/leadallocation/allocate`, payload)
      toast.success("Leads allocated successfully")
      await refreshData()
    } catch (err) {
      console.error("Error allocating leads:", err)
      toast.error("Error allocating leads")
    } finally {
      setLoading(false)
    }
  }

  // ✅ GET bulk allocation data
  const fetchBulkAllocationData = async (): Promise<BulkAllocateGetResponse> => {
    setLoading(true)
    try {
      const response = await axios.post<BulkAllocateGetResponse>(
        `${API_URL}/leadallocation/bulkallocate`
      )

      if (response.data.success && response.data.data) {
        setCampaigns(response.data.data.campaigns || campaigns)
      }

      return response.data
    } catch (err) {
      console.error("Error fetching bulk allocation data:", err)
      toast.error("Error fetching bulk allocation data")
      throw err
    } finally {
      setLoading(false)
    }
  }

  // ✅ POST bulk allocation - CORRECT PAYLOAD FORMAT
 const bulkAllocateLeads = async (
    campaignId: number, 
    userIds: number[]
): Promise<BulkAllocatePostResponse> => {
    if (!campaignId || userIds.length === 0) {
        throw new Error("Campaign ID and user IDs are required")
    }
    
    setLoading(true)
    try {
        // Get available lead IDs for distribution
        const bulkDataResponse = await fetchBulkAllocationData()
        
        if (!bulkDataResponse.success || !bulkDataResponse.data) {
            throw new Error("Failed to fetch available leads data")
        }

        const availableLeadIds = bulkDataResponse.data.leadids || []
        
        if (availableLeadIds.length === 0) {
            throw new Error("No leads available for allocation in this campaign")
        }

        // ✅ CORRECTED: lead_ids as string, user_ids as array
        const payload: BulkAllocatePostRequest = {
            campaignmid: campaignId,
            lead_ids: availableLeadIds.join(','), // string (comma-separated)
            user_ids: userIds // array of numbers ← FIXED!
        }

        console.log('📤 Bulk Allocation Payload:', payload)

        const response = await axios.post<BulkAllocatePostResponse>(
            `${API_URL}/leadallocation/bulkallocatelead`, 
            payload
        )

        if (response.data.success) {
            toast.success(`Successfully allocated leads to ${userIds.length} users`)
            await refreshData()
        } else {
            toast.error(response.data.message || "Failed to bulk allocate leads")
        }

        return response.data
    } catch (err: any) {
        console.error("Error in bulk allocation:", err)
        
        if (err.response) {
            console.error('API Error Response:', err.response.data)
        }
        
        const errorMessage = err.response?.data?.message || err.message || "Error bulk allocating leads"
        toast.error(errorMessage)
        throw err
    } finally {
        setLoading(false)
    }
}

  const deleteLeads = async () => {
    if (selectedLeads.length === 0) throw new Error("No leads selected")
    setLoading(true)
    try {
      await axios.post(`${API_URL}/delete-leads`, { leadmids: selectedLeads })
      toast.success("Leads deleted successfully")
      await refreshData()
    } catch (err) {
      console.error("Error deleting leads:", err)
      toast.error("Error deleting leads")
    } finally {
      setLoading(false)
    }
  }

  const handleImport = async (file: File, campaignmid: number) => {
    try {
      console.log("📤 Uploading file:", file.name, "for campaignmid:", campaignmid)
      const result = await importLeads(file, campaignmid)
      
      // Show detailed import results
      if (result.success) {
        if (result.imported > 0) {
          toast.success(`✅ Successfully imported ${result.imported} leads!`)
        }
        
        if (result.duplicates && result.duplicates.length > 0) {
          toast.warning(`⚠️ Found ${result.duplicates.length} duplicate leads`, {
            autoClose: false // Keep duplicate warning visible
          })
          console.log('Duplicate leads:', result.duplicates)
        }
        
        if (result.errors && result.errors.length > 0) {
          toast.error(`❌ ${result.errors.length} errors found during import`, {
            autoClose: false
          })
          console.log('Import errors:', result.errors)
        }
        
        // If no leads were imported and there are duplicates/errors
        if (result.imported === 0 && (result.duplicates.length > 0 || result.errors.length > 0)) {
          toast.info('📋 No new leads imported. Check duplicates/errors above.')
        }
      } else {
        toast.error(result.message || "Failed to import leads")
      }
      
      await refreshData()
    } catch (error) {
      console.error("Import failed:", error)
    }
  }

  const importLeads = async (file: File, campaignmid: number): Promise<ImportLeadsResponse> => {
    if (!campaignmid) throw new Error("Campaign ID is required")
    setLoading(true)
    try {
      const form = new FormData()
      form.append("file", file)
      form.append("campaignmid", campaignmid.toString())

      const res = await axios.post<ImportLeadsResponse>(
        `${API_URL}/leadallocation/importstore`, 
        form, 
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      )

      return res.data
    } catch (err: any) {
      console.error("Error importing leads:", err)
      
      // Handle API error response
      if (err.response?.data) {
        toast.error(err.response.data.message || "Error importing leads")
        return err.response.data
      } else {
        toast.error("Error importing leads")
        throw err
      }
    } finally {
      setLoading(false)
    }
  }

  return {
    leads,
    campaigns,
    users,
    loading,
    currentPage,
    totalPages,
    perPage,
    total,
    selectedLeads,
    allSelected,
    selectAllLeads,
    toggleLeadSelection,
    allocateLeads,
    deleteLeads,
    importLeads,
    handleImport,
    fetchBulkAllocationData,
    bulkAllocateLeads,
    fetchLeads,
    refreshData,
  }
}