// ============================================
//  Row after mapping → used in React table
// ============================================
// Row after mapping → supports BOTH old UI names + new API names
export interface TelecallerPerformance {
  sr_no: number
  telecaller: string
  date: string
  first_call: string
  last_call: string
  dialed: number
  answered: number
  interested: number
  confirmed: number
  talk_time: string
}

// Filters sent to API
export interface TelecallerPerformanceFilters {
  page?: number
  per_page?: number
  search?: string
  date_from?: string
  date_to?: string

  // UI expects telecaller_id, backend wants usermid → support both
  telecaller_id?: number
  usermid?: number
}


// ============================================
//  Filters sent to API
// ============================================
export interface TelecallerPerformanceFilters {
  page?: number
  per_page?: number
  search?: string
  date_from?: string
  date_to?: string
  usermid?: number
}

// ============================================
//  Telecaller list (telecallers array)
// ============================================
export interface Telecaller {
  usermid: number
  username: string
}

// ============================================
//  Raw pagination info from backend
// ============================================
export interface PaginationInfo {
  current_page: number
  last_page: number
  per_page: number
  total: number
}

// ============================================
//  Raw API item (exact backend fields)
// ============================================
export interface TelecallerPerformanceApiResponse {
  sr: number
  user: string
  date: string
  start_time: string
  end_time: string
  dialed: number
  answered: number
  confirmed: number
  interested: number
  talktime: string
  total_leads: number
  notinterested: number
}

// ============================================
//  Final API Response (FULL, EXACT)
// ============================================
export interface TelecallerPerformanceResponse {
  status: string
  message?: string
  
  data: TelecallerPerformanceApiResponse[]

  telecallers: Telecaller[]
  telecallersselect: TelecallerSelect[]

  current_page: number
  last_page: number
  per_page: number
  total: number
  from: number
  to: number
}

// ============================================
//  Detailed telecaller info (telecallersselect)
// ============================================
export interface TelecallerSelect {
  usermid: number
  leadermid: number
  username: string
  usermobile: string
  userloginid: string
  userstatus: string
  usertype: string
  userrole: string
  roleid: number | null
  userlastlogintime: string
  usernooflogin: number
  userregip: string
  designation: string | null
  detail: string | null
  useremail: string
  updated_at: string
  created_at: string
  cmpmid: number
}

// ============================================
//  Calculated Performance Metrics
// ============================================
export interface PerformanceMetrics {
  totalDialed: number
  totalAnswered: number
  totalInterested: number
  totalConfirmed: number
  totalTalkTime: string
  answerRate: number
  conversionRate: number
}
