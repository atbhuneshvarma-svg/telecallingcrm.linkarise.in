// src/app/modules/apps/reports/allleadreport/core/types.ts
export interface LeadData {
  leadmid: number;
  campaignname: string;
  username: string;
  leadname: string;
  phone: string;
  purpose: string | null;
  detail: string;
  statusname: string;
  statuscolor: string;
  activity: string;
  leadremarks: string | null;
  updatedon: string;
  email: string;
  address: string;
  followup: number;
  followupdate: string | null;
  iscalled: number;
  created_at: string;
  addedon: string;
}

export interface User {
  usermid: number;
  username: string;
  userrole: string;
  usermobile: string;
  userloginid: string;
  userstatus: string;
  usertype: string;
  designation?: string | null;
  useremail: string;
}

export interface Campaign {
  campaignmid: number;
  campaignname: string;
  campaigndate: string;
}

export interface Status {
  statusmid: number;
  stage: string;
  statusname: string;
  statuscolor: string;
}

export interface Team {
  tmid: number;
  teamname: string;
  leadermid: number;
  leader?: User;
}

export interface LeadReportResponse {
  result: boolean;
  message: string;
  data: LeadData[];
  users: User[];
  campaigns: Campaign[];
  status: Status[];
  teams: Team[];
  current_page: number;
  per_page: number;
  total_records: number;
  total_pages: number;
}

// types.ts
export interface FilterState {
  page: number;
  perPage: number;
  campaignmid?: string;  // Store campaign ID
  tmid?: string;         // Store team ID
  usermid?: string;      // Store user ID
  status?: string;       // Store status name
  dateFrom?: string;
  dateTo?: string;
}