// src/app/modules/apps/leads/fressleads/core/_models.ts

export interface FreshLead {
  leadmid: number;
  cmpmid: number;
  campaignmid: number | null;
  name: string;
  phone: string;
  email: string;
  gender?: string | null;
  dob?: string | null;
  marital_status?: string | null;
  detail?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  occupation?: string | null;
  annual_income?: string | null;
  pan_number?: string | null;
  aadhaar_number?: string | null;
  kyc_status?: string | null;
  statusname: string;
  statuscolor: string;
  activityname: string;
  followup: number;
  followupdate?: string | null;
  iscalled: number;
  leadremarks?: string | null;
  usermid: number;
  extra_field1?: string | null;
  extra_field2?: string | null;
  extra_field3?: string | null;
  created_at: string;
  updated_at: string;
  company: {
    cmpmid: number;
    cname: string;
    cemail: string;
    cmobile: string;
    cstatus: boolean;
    cexpierydate: string;
    ctotaluser: number;
    caddress: string;
    ccity: string;
    created_at: string;
    updated_at: string;
  };
  campaign?: {
    campaignmid: number;
    cmpmid: number;
    campaignname: string;
    campaigndate: string;
    created_at: string;
    updated_at: string;
  } | null;
  user: {
    usermid: number;
    username: string;
    useremail?: string;
  };
  sourceofinquiry: string;
  purpose: string;
}

// ✅ Filters for API
export interface FreshLeadFilters {
  search?: string;
  campaignmid?: number;
  statusname?: string;
  usermid?: number;
  page?: number;
  per_page?: number;
}

// ✅ API response type
export interface FreshLeadResponse {
  status: string;
  current_page: number;
  total_pages: number;
  total_rows: number;
  data: FreshLead[];
  per_page?: number;
}
