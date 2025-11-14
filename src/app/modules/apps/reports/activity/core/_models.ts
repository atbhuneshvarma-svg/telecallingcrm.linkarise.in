export interface ActivityLog {
  logmid: number;
  cmpmid: number;
  usermid: number;
  module: string;
  record_id: number;
  action: string;
  description: string;
  ip_address: string;
  created_at: string;
}

export interface ActivityLogsResponse {
  result: boolean;
  message: string;
  data: ActivityLog[];
  current_page: number;
  per_page: number;
  total_records: number;
  total_pages: number;
}

export interface ActivityLogsFilters {
  page?: number;
  per_page?: number;
  module?: string;
  action?: string;
  user_id?: number;
  start_date?: string;
  end_date?: string;
  search?: string;
}
