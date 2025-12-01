// src/app/modules/apps/leads/core/_requests.ts
import axios from 'axios'

const API_URL = import.meta.env.VITE_APP_THEME_API_URL

export interface StatusWiseLeadsParams {
  leadmids: number[]
  page?: number
  per_page?: number
  search?: string
  campaign?: string
  telecaller?: string
  statusname?: string
}

export interface LeadStatusData {
  leadmid: number
  prospectname: string
  mobile: string
  campaign: string
  telecaller: string
  statusname: string
  statusdate: string
  created_at: string
}

export interface StatusWiseLeadsResponse {
  status: boolean
  data: {
    current_page: number
    data: LeadStatusData[]
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
}

export const getStatusWiseLeads = async (
  params: StatusWiseLeadsParams
): Promise<StatusWiseLeadsResponse> => {
  try {
    // For POST request with array parameters
    const formData = new FormData()
    
    // Add leadmids as array
    params.leadmids.forEach((id, index) => {
      formData.append(`leadmids[${index}]`, id.toString())
    })
    
    // Add other parameters
    if (params.page) formData.append('page', params.page.toString())
    if (params.per_page) formData.append('per_page', params.per_page.toString())
    if (params.search) formData.append('search', params.search)
    if (params.campaign) formData.append('campaign', params.campaign)
    if (params.telecaller) formData.append('telecaller', params.telecaller)
    if (params.statusname) formData.append('statusname', params.statusname)
    
    const response = await axios.post(`${API_URL}/lead/statuswise`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    
    return response.data
  } catch (error) {
    console.error('Error fetching status wise leads:', error)
    throw error
  }
}

// Alternative using query parameters for GET
export const getStatusWiseLeadsGET = async (
  params: StatusWiseLeadsParams
): Promise<StatusWiseLeadsResponse> => {
  try {
    // Build query string for array parameters
    const queryParams = new URLSearchParams()
    
    // Add leadmids as array
    params.leadmids.forEach(id => {
      queryParams.append('leadmids[]', id.toString())
    })
    
    // Add other parameters
    if (params.page) queryParams.append('page', params.page.toString())
    if (params.per_page) queryParams.append('per_page', params.per_page.toString())
    if (params.search) queryParams.append('search', params.search)
    if (params.campaign) queryParams.append('campaign', params.campaign)
    if (params.telecaller) queryParams.append('telecaller', params.telecaller)
    if (params.statusname) queryParams.append('statusname', params.statusname)
    
    const url = `${API_URL}/lead/statuswise?${queryParams.toString()}`
    const response = await axios.get(url)
    
    return response.data
  } catch (error) {
    console.error('Error fetching status wise leads:', error)
    throw error
  }
}