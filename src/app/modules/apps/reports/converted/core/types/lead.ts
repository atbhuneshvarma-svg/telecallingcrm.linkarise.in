export interface ConvertedLead {
  leadmid: number
  cmpmid: number
  campaignname: string
  companymid: number
  sourceofinquiry: string | null
  purpose: string | null
  address: string | null
  activity: string
  detail: string
  extra_field1: string | null
  extra_field2: string | null
  extra_field3: string | null
  username: string
  leadname: string
  phone: string
  email: string
  statusname: string
  followup: number
  leadremarks: string
  usermid: number
  iscalled: number
  created_at: string
  addedon: string
  updatedon: string
}

export interface ConvertedLeadsResponse {
  result: boolean
  message: string
  data: ConvertedLead[]
  current_page: number
  per_page: number
  total_records: number
  total_pages: number
}

export interface ConvertedLeadFilters {
  page?: number
  per_page?: number
  search?: string
  team?: string
  user?: string
  campaign?: string
}

export type SortField = keyof ConvertedLead
export type SortDirection = 'asc' | 'desc'