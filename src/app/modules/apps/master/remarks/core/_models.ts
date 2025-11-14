export interface RemarksTemplate {
  id: number;
  content: string;
  cmpmid?: number;
  created_at?: string;
  updated_at?: string;
}

export interface PaginationInfo {
  current_page: number;
  per_page: number;
  total_records: number;
  total_pages: number;
}