// src/app/modules/apps/leads/statuswise/core/_models.ts
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

export interface Filters {
  leadmids: number[]
  page: number
  per_page: number
  date_from: string
  date_to: string
  campaign: string
  telecaller: string
  statusname: string
}

export interface FilterOptions {
  campaigns: Array<{ value: string; label: string }>
  telecallers: Array<{ value: string; label: string }>
  statuses: Array<{ value: string; label: string }>
}