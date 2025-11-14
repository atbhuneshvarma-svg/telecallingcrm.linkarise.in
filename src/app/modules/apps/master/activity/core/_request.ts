// src/app/modules/apps/master/activity/core/_request.ts
import axios from "axios";

const API_URL = import.meta.env.VITE_APP_THEME_API_URL;

// Endpoints
const GET_ACTIVITY_URL = `${API_URL}/activity`;
const ADD_ACTIVITY_URL = `${API_URL}/activityadd`;
const ACTIVITY_URL = `${API_URL}/activity`; // for update/delete

export interface Activity {
  id: number;
  name: string;
}

export interface PaginationInfo {
  current_page: number;
  per_page: number;
  total_records: number;
  total_pages: number;
}

export interface PaginatedResponse {
  data: Activity[];
  current_page: number;
  per_page: number;
  total_records: number;
  total_pages: number;
}

// API Response interface
interface ApiResponse<T> {
  result: boolean;
  data: T;
  current_page: number;
  per_page: number;
  total_records: number;
  total_pages: number;
  message?: string;
}

// Utility function to check API success
const isApiSuccess = (data: any) => data?.result === true;

// Utility function to handle API errors
export const handleApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return (
      error.response?.data?.message || error.message || "API request failed"
    );
  }
  return error instanceof Error ? error.message : "Unknown error occurred";
};

// -------------------------
// Enhanced API object with pagination
// -------------------------
export const activityApi = {
  // Get all activities (without pagination)
  async getAllActivities(): Promise<Activity[]> {
    try {
      const response = await axios.post<ApiResponse<any[]>>(GET_ACTIVITY_URL);
      console.log("Get All Activities Response:", response.data);

      if (!isApiSuccess(response.data)) {
        throw new Error(response.data.message || "API returned false result");
      }

      return response.data.data.map((item: any) => ({
        id: item.activitymid,
        name: item.activityname,
      }));
    } catch (error) {
      console.error("Error fetching activities:", error);
      throw error;
    }
  },

  // Get activities with pagination - SERVER-SIDE PAGINATION
  async getActivitiesPaginated(
    page: number = 1,
    perPage: number = 10
  ): Promise<PaginatedResponse> {
    try {
      console.log(`Fetching activities - Page: ${page}, Per Page: ${perPage}`);

      const response = await axios.post<ApiResponse<any[]>>(GET_ACTIVITY_URL, {
        page,
        per_page: perPage,
      });

      console.log("Paginated Activities API Response:", response.data);

      if (!isApiSuccess(response.data)) {
        throw new Error(response.data.message || "API returned false result");
      }

      return {
        data: response.data.data.map((item: any) => ({
          id: item.activitymid,
          name: item.activityname,
        })),
        current_page: response.data.current_page,
        per_page: response.data.per_page,
        total_records: response.data.total_records,
        total_pages: response.data.total_pages,
      };
    } catch (error) {
      console.error("Error fetching paginated activities:", error);
      throw error;
    }
  },

  async createActivity(activity: Omit<Activity, "id">): Promise<Activity> {
    try {
      const response = await axios.post<ApiResponse<any>>(ADD_ACTIVITY_URL, {
        activityname: activity.name,
      });

      if (response.status !== 200) {
        throw new Error(response.data.message || "API returned false result");
      }

      const item = response.data.data;
      return {
        id: item.activitymid,
        name: item.activityname,
      };
    } catch (error) {
      console.error("Error creating activity:", error);
      throw error;
    }
  },

  async updateActivity(
    id: number,
    activity: Omit<Activity, "id">
  ): Promise<Activity> {
    try {
      const response = await axios.put<ApiResponse<any>>(
        `${ACTIVITY_URL}/${id}`,
        {
          activityname: activity.name,
        }
      );

      if (response.status !== 200) {
        throw new Error(response.data.message || "API returned false result");
      }

      const item = response.data.data;
      return {
        id: item.activitymid,
        name: item.activityname,
      };
    } catch (error) {
      console.error("Error updating activity:", error);
      throw error;
    }
  },

  async deleteActivity(id: number): Promise<void> {
    try {
      const response = await axios.delete<ApiResponse<void>>(
        `${ACTIVITY_URL}/${id}`
      );

      if (response.status !== 200) {
        throw new Error(`Unexpected response status: ${response.status}`);
      }

      if (response.status !== 200 && !isApiSuccess(response.data)) {
        throw new Error(response.data.message || "Failed to delete activity");
      }

      console.log("✅ Activity deleted successfully");
    } catch (error) {
      console.error("❌ Error deleting activity:", error);
      throw error;
    }
  },
};

// -------------------------
// Legacy CRUD Functions (keep for compatibility)
// -------------------------

// ✅ Get all activities
export const getActivities = async (): Promise<Activity[]> => {
  return activityApi.getAllActivities();
};

// ✅ Add activity
export const addActivity = async (name: string): Promise<Activity> => {
  return activityApi.createActivity({ name });
};

// ✅ Update activity
export const updateActivity = async (
  id: number,
  name: string
): Promise<Activity> => {
  return activityApi.updateActivity(id, { name });
};

// ✅ Delete activity
export const deleteActivity = async (id: number): Promise<void> => {
  return activityApi.deleteActivity(id);
};
