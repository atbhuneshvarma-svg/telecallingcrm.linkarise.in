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
  createdon?: string;
  updatedon?: string;
  totalmembers?: number;
  members?: TeamMember[];
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
  sortOrder?: "asc" | "desc";
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
  tmbmid: number;
  teamid: number;
  usermid: number;
  created_at: string;
  updated_at: string;
  user: {
    usermid: number;
    username: string;
    usermobile: string;
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
  };
}

export interface TeamDetailsResponse {
  result: boolean;
  message?: string;
  data?: {
    team?: Team;
    agents?: User[];
    members?: TeamMember[];
  };
  // Or if the API returns directly:
  status?:string;
  team?: Team;
  agents?: User[];
  members?: TeamMember[];
}