export interface User {
  usermid: number;
  leadermid: number;
  username: string;
  usermobile: string | null;
  userloginid: string;
  userstatus: string;
  usertype: string;
  userrole: string;
  userlastlogintime: string;
  usernooflogin: number;
  userregip: string;
  designation: string | null;
  detail: string | null;
  useremail: string;
  updated_at: string;
  created_at: string;
  cmpmid: number;
}

export interface Team {
  tmid: number;
  teamname: string;
  leadermid: number;
  cmpmid: number;
  created_at: string;
  updated_at: string;
  leader: User;
  // Add these properties for the team details page
  createdon?: string;
  updatedon?: string;
  totalmembers?: number;
}

export interface TeamsResponse {
  result: boolean;
  data: Team[];
  current_page: number;
  per_page: number;
  total_records: number;
  total_pages: number;
}

export interface PaginationParams {
  page: number;
  limit: number;
  search: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CreateTeamRequest {
  teamname: string;
  leadermid: number;
  tmid?: number;
}

export interface UpdateTeamRequest {
  teamname?: string;
  leadermid?: number;
  tmid?: number;
}

export interface TeamMember {
  tmid: number;
  usermid: number; // Changed from userid to usermid
  username: string;
  userrole: string;
  operation: string;
}

// Add interface for team details response
export interface TeamDetailsResponse {
  result: boolean;
  data: Team;
  members?: TeamMember[];
}