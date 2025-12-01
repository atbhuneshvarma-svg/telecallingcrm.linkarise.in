export interface Lead {
  leadmid: number
  prospectname: string
  mobile: string
  campaign: string
  telecaller: string
  stage: string
  stagedate: string
  created_at: string
}

export interface Pagination {
  page: number
  per_page: number
  total: number
}

export interface Filters {
  campaign: string
  user: string
  stage: string
}