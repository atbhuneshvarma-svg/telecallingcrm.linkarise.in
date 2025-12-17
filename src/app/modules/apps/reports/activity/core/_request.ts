import axios from 'axios';
import { ActivityLogsResponse, ActivityLogsFilters } from './_models';

const API_URL = import.meta.env.VITE_APP_API_URL;
export const ACTIVITY_LOGS_URL = `${API_URL}/api/activitylog`;

export const activityLogsApi = {
  // Get activity logs with pagination and filters - POST request with body parameters
  getActivityLogs: async (filters: ActivityLogsFilters = {}): Promise<ActivityLogsResponse> => {
    const response = await axios.post<ActivityLogsResponse>(ACTIVITY_LOGS_URL, {
      page: filters.page || 1,
      per_page: filters.per_page || 10,
      module: filters.module,
      action: filters.action,
      user_id: filters.user_id,
      start_date: filters.start_date,
      end_date: filters.end_date,
      search: filters.search, // This will search through action and description
    });
    return response.data;
  },

  // Export activity logs
  exportActivityLogs: async (filters: ActivityLogsFilters = {}): Promise<Blob> => {
    const response = await axios.post(`${ACTIVITY_LOGS_URL}/export`, {
      page: filters.page || 1,
      per_page: filters.per_page || 10,
      module: filters.module,
      action: filters.action,
      user_id: filters.user_id,
      start_date: filters.start_date,
      end_date: filters.end_date,
      search: filters.search,
    }, {
      responseType: 'blob',
      headers: {
        'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      },
    });
    return response.data;
  },
};