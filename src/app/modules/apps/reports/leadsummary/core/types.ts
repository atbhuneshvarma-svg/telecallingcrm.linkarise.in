export interface LeadSummaryData {
  user: string;
  total_lead: number;
  fresh: number;
  followup: number;
  interested: number;
  converted: number;
  not_interested: number;
}

export interface LeadSummaryResponse {
  status: boolean;
  data: {
    current_page: number;
    data: LeadSummaryData[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: Array<{
      url: string | null;
      label: string;
      active: boolean;
    }>;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
  };
}

export interface FilterState {
  page: number;
  perPage: number;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  from: number;
  to: number;
  perPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}