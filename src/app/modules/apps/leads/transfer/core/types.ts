// _models.ts
export interface Lead {
  leadmid: number;
  campaignname: string;
  username: string;
  leadname: string;
  phone: string;
  purpose: string;
  detail: string;
  stage: string;
  statusname: string;
  statuscolor: string;
  activity: string;
  email: string;
  address: string;
  followup: number;
  followupdate: string | null;
  leadremarks: string | null;
  created_at: string;
  usermid: number;
  cmpmid: number;
  sourceofinquiry: string | null;
  updatedon: string | null;
}

export interface User {
  usermid: number;
  username: string;
  userloginid: string;
  userrole: string;
  usermobile: string;
  useremail: string;
  userstatus: string;
  usertype: string;
  designation: string | null;
  cmpmid: number;
}

export interface Team {
  tmid: number;
  teamname: string;
  leadermid: number;
  cmpmid: number;
  leader: User;
  members: Array<{
    tmbmid: number;
    teamid: number;
    usermid: number;
    user: User;
  }>;
}

export interface Status {
  statusmid: number;
  stage: string;
  statusname: string;
  statuscolor: string;
  cmpmid: number;
}

export interface Campaign {
  campaignmid: number;
  campaignname: string;
  cmpmid: number;
  campaigndate: string;
}

export interface TransferRequest {
  leadIds: number[];
  targetUserId?: number;
  targetTeamId?: number;
}

export interface TransferResponse {
  success: boolean;
  message: string;
  transferredCount: number;
}

export interface LeadListResponse {
  result: boolean;
  message: string;
  data: Lead[];
  users: User[];
  teams: Team[];
  status: Status[];
  campaigns: Campaign[];
  current_page: number;
  per_page: number;
  total_records: number;
  total_pages: number;
}

// Add to your types file
export interface BulkTransferRequest {
  fromUser?: string;
  fromStatus?: string;
  fromCampaign?: string;
  toUser: number;
}

export interface BulkTransferResponse {
  result: boolean;
  message: string;
  transferred_count: number;
}

export interface BulkTransferCountRequest {
  fromUser?: string;
  fromStatus?: string;
  fromCampaign?: string;
}

export interface BulkTransferCountResponse {
  count: number;
}