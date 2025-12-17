import axios from "axios";
import { AuthModel, UserModel , NotificationsResponse , DashboardStats} from "./_models";

const API_URL = import.meta.env.VITE_APP_API_URL;

export const GET_USER_BY_ACCESSTOKEN_URL = `${API_URL}/api/verify_token`;
export const LOGIN_URL = `${API_URL}/api/loginweb`;
export const REGISTER_URL = `${API_URL}/api/register`;
export const REQUEST_PASSWORD_URL = `${API_URL}/api/forgot_password`;
export const DASHBOARD_URL = `${API_URL}/api/webdashboard`;
export const NOTIFICATIONS_URL = `${API_URL}/api/notifications/all`;
export const LATEST_NOTIFICATIONS_URL = `${API_URL}/api/notificationslatest`;



/* -------------------------
   Auth APIs
------------------------- */
export function login(userloginid: string, password: string) {
  return axios.post<AuthModel>(LOGIN_URL, { userloginid, password });
}

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

export function requestPassword(email: string) {
  return axios.post<{ result: boolean }>(REQUEST_PASSWORD_URL, { email });
}

export function getUserByToken(token: string) {
  return axios.post<UserModel>(GET_USER_BY_ACCESSTOKEN_URL, {
    api_token: token,
  });
}


/* -------------------------
   Dashboard API
------------------------- */
export function getDashboardStats() {
  return axios.post<DashboardStats>(DASHBOARD_URL, {}, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    timeout: 10000
  });
}

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


/* -------------------------
   Notifications API
------------------------- */
export const notificationsApi = {
  getNotifications: async (page: number = 1, perPage: number = 10): Promise<NotificationsResponse> => {
    const response = await axios.post(NOTIFICATIONS_URL, { page, per_page: perPage });
    return response.data;
  },

  getAllNotifications: async (): Promise<NotificationsResponse> => {
    const response = await axios.post(LATEST_NOTIFICATIONS_URL, { page: 1, per_page: 10000 });
    return response.data;
  }
};
