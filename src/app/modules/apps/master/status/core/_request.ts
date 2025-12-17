// src/app/modules/apps/master/status/core/_request.ts
import axios from "axios";

const API_URL = import.meta.env.VITE_APP_THEME_API_URL;

// Endpoints
const GET_STATUS_URL = `${API_URL}/status`;
const ADD_STATUS_URL = `${API_URL}/statusadd`;
const STATUS_URL = `${API_URL}/status`;

export interface Status {
  id: number;
  name: string;
  stage: string; // Add this field
  color: string;
  cmpmid?: number;
  created_at?: string;
  updated_at?: string;
}

export interface PaginationInfo {
  current_page: number;
  per_page: number;
  total_records: number;
  total_pages: number;
}

export interface PaginatedResponse {
  data: Status[];
  current_page: number;
  per_page: number;
  total_records: number;
  total_pages: number;
}

// API Response interfaces
interface ApiResponse<T> {
  result: boolean;
  success?: false;
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
    return error.response?.data?.message || error.message || "API request failed";
  }
  return error instanceof Error ? error.message : "Unknown error occurred";
};

// -------------------------
// Enhanced API object with pagination
// -------------------------
export const statusApi = {
  // Get all statuses (without pagination)
  async getAllStatuses(): Promise<Status[]> {
    try {
      const response = await axios.post<ApiResponse<any[]>>(GET_STATUS_URL);
      console.log('Get All Statuses Response:', response.data);

      if (!isApiSuccess(response.data)) {
        throw new Error(response.data.message || "API returned false result");
      }

      return response.data.data.map((item: any) => ({
        id: item.statusmid,
        name: item.statusname,
        stage: item.stage, // Add this line
        color: item.statuscolor || "#0d6efd",
        cmpmid: item.cmpmid,
        created_at: item.created_at,
        updated_at: item.updated_at,
      }));
    } catch (error) {
      console.error("Error fetching statuses:", error);
      throw error;
    }
  },

  // Get statuses with pagination - SERVER-SIDE PAGINATION
  async getStatusesPaginated(page: number = 1, perPage: number = 10): Promise<PaginatedResponse> {
    try {
      console.log(`Fetching statuses - Page: ${page}, Per Page: ${perPage}`);
      
      const response = await axios.post<ApiResponse<any[]>>(
        GET_STATUS_URL,
        { page, per_page: perPage }
      );
      
      console.log('Paginated Statuses API Response:', response.data);

      if (!isApiSuccess(response.data)) {
        throw new Error(response.data.message || "API returned false result");
      }

      return {
        data: response.data.data.map((item: any) => ({
          id: item.statusmid,
          name: item.statusname,
          stage: item.stage, // Add this line
          color: item.statuscolor || "#0d6efd",
          cmpmid: item.cmpmid,
          created_at: item.created_at,
          updated_at: item.updated_at,
        })),
        current_page: response.data.current_page,
        per_page: response.data.per_page,
        total_records: response.data.total_records,
        total_pages: response.data.total_pages
      };
    } catch (error) {
      console.error("Error fetching paginated statuses:", error);
      throw error;
    }
  },

  async createStatus(status: Omit<Status, "id">): Promise<Status> {
    try {
      const response = await axios.post<ApiResponse<any>>(
        `${ADD_STATUS_URL}?statusname=${encodeURIComponent(status.name)}&statuscolor=${encodeURIComponent(status.color)}`
      );

      if (response.status!==200 || !response.data.success == true) {
        throw new Error(response.data.message || "API returned false result");
      }

      const item = response.data.data;
      return {
        id: item.statusmid,
        name: item.statusname,
        stage: item.stage, // Add this line
        color: item.statuscolor || "#0d6efd",
        cmpmid: item.cmpmid,
        created_at: item.created_at,
        updated_at: item.updated_at,
      };
    } catch (error) {
      console.error("Error creating status:", error);
      throw error;
    }
  },

  async updateStatus(id: number, status: Omit<Status, "id">): Promise<Status> {
    try {
      const response = await axios.put<ApiResponse<any>>(
        `${STATUS_URL}?statusmid=${id}`,
        {
          statusname: status.name,
          statuscolor: status.color,
          stage: status.stage,
        }
      );

      if (response.status!==200 || !response.data.success == true) {
        throw new Error(response.data.message || "API returned false result");
      }

      const item = response.data.data;
      return {
        id: item.statusmid,
        name: item.statusname,
        stage: item.stage, // Add this line
        color: item.statuscolor || "#0d6efd",
        cmpmid: item.cmpmid,
        created_at: item.created_at,
        updated_at: item.updated_at,
      };
    } catch (error) {
      console.error("Error updating status:", error);
      throw error;
    }
  },

  async deleteStatus(id: number): Promise<void> {
    try {
      const response = await axios.delete<ApiResponse<void>>(
        `${STATUS_URL}?statusmid=${id}`
      );

      if (response.status !== 200 && response.status !== 204) {
        throw new Error(`Unexpected response status: ${response.status}`);
      }

      if (response.status!==200 || !response.data.success == true) {
        throw new Error(response.data.message || "Failed to delete status");
      }

      console.log("✅ Status deleted successfully");
    } catch (error) {
      console.error("❌ Error deleting status:", error);
      throw error;
    }
  },
};

// -------------------------
// Legacy CRUD Functions (keep for compatibility)
// -------------------------

// Get statuses with pagination
export const getStatuses = async (
  page: number = 1,
  perPage: number = 10
): Promise<PaginatedResponse> => {
  return statusApi.getStatusesPaginated(page, perPage);
};

// Add status
export const addStatus = async (
  name: string,
  color: string = "#0d6efd"
): Promise<Status> => {
  return statusApi.createStatus({ name, color , stage: '' });
};

// Update status
export const updateStatus = async (
  id: number,
  name: string,
  color: string,
  stage: string = ''
): Promise<Status> => {
  return statusApi.updateStatus(id, { name, color, stage });
};

// Delete status
export const deleteStatus = async (id: number): Promise<void> => {
  return statusApi.deleteStatus(id);
};