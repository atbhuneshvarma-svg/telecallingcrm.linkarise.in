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

export interface TelecallerPerformanceFilters {
  page: number
  per_page: number
  search?: string
  date_from?: string
  date_to?: string
  telecaller_id?: number
}

export interface Telecaller {
  usermid: number
  username: string
}

export interface PaginationInfo {
  current_page: number
  per_page: number
  total_pages: number
  total_rows: number
  from: number
  to: number
}

// API Response Interfaces
export interface TelecallerPerformanceApiResponse {
  sr: number
  user: string
  date: string
  start_time: string
  end_time: string
  dialed: number
  answered: number
  interested: number
  confirmed: number
  talktime: string
}

export interface PaginationLink {
  url: string | null
  label: string
  active: boolean
}

export interface TelecallerPerformanceRows {
  current_page: number
  data: TelecallerPerformanceApiResponse[]
  first_page_url: string
  from: number
  last_page: number
  last_page_url: string
  links: PaginationLink[]
  next_page_url: string | null
  path: string
  per_page: number
  prev_page_url: string | null
  to: number
  total: number
}

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

export interface TelecallerPerformanceResponse {
  rows: TelecallerPerformanceRows
  daterange: string | null
  telecallers: Telecaller[]
  usermid: string
  search: string
  telecallersselect: TelecallerSelect[]
  perPage: number
}

// Performance Metrics Interface
export interface PerformanceMetrics {
  totalDialed: number
  totalAnswered: number
  totalInterested: number
  totalConfirmed: number
  totalTalkTime: string
  answerRate: number
  conversionRate: number
}