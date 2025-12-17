// src/app/modules/apps/leads/core/_models.ts
// src/app/modules/apps/leads/core/_models.ts
export interface Lead {
  leadmid: number;
  cmpmid: number;
  companymid?: number;
  campaignmid?: number;
  campaignname?: string;
  sourceofinquiry?: string;
  sourceofinquirymid?: number;
  purpose?: string;
  purposemid?: number;
  statusmid?: number;
  statusname: string;
  statuscolor?: string;
  name: string;
  leadname?: string;
  phone: string;
  email: string;
  address: string;
  activity?: string | null;
  detail?: string | null;
  extra_field1?: string | null;
  extra_field2?: string | null;
  extra_field3?: string | null;
  username?: string;
  followup?: number;
  leadremarks?: string | null;
  usermid: number;
  teamname?: string; // ✅ NEW FIELD
  teamid?: number; // ✅ optional, if backend sends ID too
  iscalled?: number;
  created_at?: string;
  updated_at?: string;
  isSelected?: boolean;
  updatedon?: string;
  addedon?: string;
  addedby?: string;
  updatedby?: string; 
  followupdate?: string;
}

// src/app/modules/apps/leads/core/_models.ts

export interface PaginationInfo {
  current_page: number;
  per_page: number;
  total_records: number;
  total_pages: number;
}

export interface LeadApiResponse {
  result: boolean;
  status: boolean;
  message: string;
  data: Lead[];
  current_page: number;
  per_page: number;
  total_records: number;
  total_pages: number;
}

export interface CreateLeadRequest {
  name: string;
  phone: string;
  email: string;
  address: string;
  campaignmid: number;
  purposemid: number;
  sourceofinquirymid: number;
  activityname: string;    // ✅ ADD THIS
  statusname: string;
  usermid: number;
  detail?: string;
  leadremarks?: string;
  statusmid?: number;
  cmpmid?: number;
  companymid?: number;
  followup?: number;
  iscalled?: number;
  extra_field1?: string | null;
  extra_field2?: string | null;
  extra_field3?: string | null;
}

// Add this to your existing _models.ts
export type UpdateLeadRequest = Partial<
  Omit<Lead, 'leadmid' | 'created_at'>
> & {
  activityname?: string;
};

