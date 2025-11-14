import axios from "axios";
import { AuthModel, UserModel } from "./_models";

const API_URL = import.meta.env.VITE_APP_API_URL;

export const GET_USER_BY_ACCESSTOKEN_URL = `${API_URL}/api/verify_token`;
export const LOGIN_URL = `${API_URL}/api/loginweb`;
export const REGISTER_URL = `${API_URL}/api/register`;
export const REQUEST_PASSWORD_URL = `${API_URL}/api/forgot_password`;
export const DASHBOARD_URL = `${API_URL}/api/webdashboard`;
export const NOTIFICATIONS_URL = `${API_URL}/api/notifications`;
export const LATEST_NOTIFICATIONS_URL=`{API_URL}/api/notificationslatest`;


// Dashboard Stats Interface
export interface DashboardStats {
  todayLeadCount: number
  todayLeadCountcf: number
  thismonthclientCount: number // Add this line
  campaignCount: number // Add this line
  users: Array<{
    usermid: number
    username: string
    usermobile: string
    userloginid: string
    userstatus: string
    usertype: string
    userrole: string
    userlastlogintime: string
    usernooflogin: number
    userregip: string
    designation: string | null
    detail: string | null
    useremail: string
    updated_at: string
    created_at: string
    cmpmid: number
  }>
  userstf: Array<any>
  leadscalltodaypf: Record<string, any[]>
  leadCount: number
  months: string[]
  totalCallsData: number[]
  confirmedCallsData: number[]
  recentConfirmedLeads: any[]
  totalLeads: number[]
  convertedClients: number[]
  today: string
}

// Notification Interface
export interface Notification {
  notimid: number;
  cmpmid: number;
  usermid: number;
  title: string;
  message: string;
  type: string;
  related_id: number | null;
  related_ids: string;
  related_table: string;
  is_read: number;
  addedby: number;
  created_at: string;
}

// Notifications Response Interface
export interface NotificationsResponse {
  result: boolean;
  message: string;
  data: Notification[];
  current_page: number;
  per_page: number;
  total_records: number;
  total_pages: number;
}

// Server should return AuthModel
export function login(userloginid: string, password: string) {
  return axios.post<AuthModel>(LOGIN_URL, {
    userloginid,
    password,
  });
}

// Server should return AuthModel
export function register(
  email: string,
  firstname: string,
  lastname: string,
  password: string,
  password_confirmation: string
) {
  return axios.post(REGISTER_URL, {
    email,
    first_name: firstname,
    last_name: lastname,
    password,
    password_confirmation,
  });
}

// Server should return object => { result: boolean } (Is Email in DB)
export function requestPassword(email: string) {
  return axios.post<{ result: boolean }>(REQUEST_PASSWORD_URL, {
    email,
  });
}

export function getUserByToken(token: string) {
  return axios.post<UserModel>(GET_USER_BY_ACCESSTOKEN_URL, {
    api_token: token,
  });
}

// Dashboard Service - Get Dashboard Stats
export function getDashboardStats() {
  return axios.post<DashboardStats>(DASHBOARD_URL, {}, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    timeout: 10000
  });
}

// Optional: Get Dashboard Stats with Auth Token
export function getDashboardStatsWithAuth(token: string) {
  return axios.post<DashboardStats>(DASHBOARD_URL, {}, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    timeout: 10000
  });
}


// Notifications API - POST based fetch (following your example pattern)
export const notificationsApi = {
  // Get notifications with pagination - POST request
  getNotifications: async (page: number = 1, perPage: number = 10): Promise<NotificationsResponse> => {
    const response = await axios.post(NOTIFICATIONS_URL, {
      page,
      per_page: perPage,
    });
    return response.data;
  },

  // Get all notifications
  getAllNotifications: async (): Promise<NotificationsResponse> => {
    const response = await axios.post(LATEST_NOTIFICATIONS_URL, {
      page: 1,
      per_page: 10000,
    });
    return response.data;
  }
};