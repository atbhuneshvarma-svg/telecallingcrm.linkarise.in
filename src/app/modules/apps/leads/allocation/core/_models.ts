// core/_models.ts

// core/_models.ts
export interface Lead {
  // API fields (from your response)
  leadmid: number
  cmpmid: number
  campaignmid: number
  sourceofinquirymid: number
  purposemid: number
  name: string | null
  phone: string
  email: string
  detail: string | null
  address: string
  statusname: string
  statuscolor: string
  activityname: string
  followup: number
  followupdate: string | null
  iscalled: number
  leadremarks: string | null
  statusmid: number
  usermid: number
  isclient: number
  extra_field1: string | null
  extra_field2: string | null
  extra_field3: string | null
  created_at: string
  updated_at: string
  campaign?: {
    campaignmid: number
    cmpmid: number
    campaignname: string
    campaigndate: string
    created_at: string
    updated_at: string
  }
  campaignname?: string  // Add this - it exists in your API response
  
  // UI fields
  isSelected?: boolean
  leadname?: string
  username?: string
}

export interface AllocationData {
  leadIds: number[]
  assignedTo: number
}

export interface Campaign {
  campaignmid: number
  campaignname: string
  cmpmid: number
  campaigndate: string
  created_at: string
  updated_at: string
}

export interface User {
  usermid: number
  leadermid: number
  username: string
  usermobile: string | null
  userloginid: string
  userstatus: string
  usertype: string
  userrole: string
  userlastlogintime: string
  usernooflogin: number
  userregip: string | null
  designation: string | null
  detail: string | null
  useremail: string
  updated_at: string
  created_at: string
  cmpmid: number
}

// API Response interface
export interface LeadAllocationResponse {
  success: boolean
  data: {
    leads: {
      current_page: number
      data: Lead[]
      first_page_url: string
      from: number
      last_page: number
      last_page_url: string
      links: Array<{ url: string | null; label: string; active: boolean }>
      next_page_url: string | null
      path: string
      per_page: number
      prev_page_url: string | null
      to: number
      total: number
    }
    campaigns: Campaign[]
    users: User[]
  }
}