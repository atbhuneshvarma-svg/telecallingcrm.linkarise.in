// src/app/modules/apps/master/source-of-inquiry/core/_request.ts
import axios from "axios";

const API_URL = import.meta.env.VITE_APP_THEME_API_URL;

// Endpoints
const GET_SOURCE_OF_INQUIRY_URL = `${API_URL}/sourceofinquiry`;
const ADD_SOURCE_OF_INQUIRY_URL = `${API_URL}/sourceofinquiryadd`;
const SOURCE_OF_INQUIRY_URL = `${API_URL}/sourceofinquiry`; // for update/delete

export interface SourceOfInquiry {
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
  data: SourceOfInquiry[];
  current_page: number;
  per_page: number;
  total_records: number;
  total_pages: number;
}

// API Response interfaces
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
// Enhanced API object
// -------------------------
export const sourceOfInquiryApi = {
  // Get all source of inquiries (without pagination)
  async getAllSourceOfInquiries(): Promise<SourceOfInquiry[]> {
    try {
      const response = await axios.post(GET_SOURCE_OF_INQUIRY_URL);

      if (!isApiSuccess(response.data)) {
        throw new Error(response.data.message || "API returned failure");
      }

      return response.data.data.map((item: any) => ({
        id: item.sourceofinquirymid,
        name: item.sourceofinquiryname,
      }));
    } catch (error) {
      console.error("Error fetching source of inquiries:", error);
      throw error;
    }
  },

  // Get source of inquiries with pagination - SERVER-SIDE PAGINATION
  async getSourceOfInquiriesPaginated(
    page: number = 1,
    perPage: number = 10
  ): Promise<PaginatedResponse> {
    try {
      console.log(
        `Fetching source of inquiries - Page: ${page}, Per Page: ${perPage}`
      );

      const response = await axios.post<ApiResponse<any[]>>(
        GET_SOURCE_OF_INQUIRY_URL,
        { page, per_page: perPage }
      );

      console.log("Paginated Source of Inquiry API Response:", response.data);

      if (!isApiSuccess(response.data)) {
        throw new Error(
          response.data.message || "API returned unsuccessful status"
        );
      }

      return {
        data: response.data.data.map((item: any) => ({
          id: item.sourceofinquirymid,
          name: item.sourceofinquiryname,
        })),
        current_page: response.data.current_page,
        per_page: response.data.per_page,
        total_records: response.data.total_records,
        total_pages: response.data.total_pages,
      };
    } catch (error) {
      console.error("Error fetching paginated source of inquiries:", error);
      throw error;
    }
  },

  async createSourceOfInquiry(
    sourceOfInquiry: Omit<SourceOfInquiry, "id">
  ): Promise<SourceOfInquiry> {
    try {
      const response = await axios.post(ADD_SOURCE_OF_INQUIRY_URL, {
        sourceofinquiryname: sourceOfInquiry.name,
      });

      console.log("Create Source of Inquiry Response:", response.data);

      // Only throw if the API actually failed
      if (response.data.status !== 'success') {
        throw new Error(response.data.message || "API returned failure");
      }

      // Extract the last created item if data is array
      const item = Array.isArray(response.data.data)
        ? response.data.data[response.data.data.length - 1]
        : response.data.data;

      if (!item) {
        throw new Error("Invalid API response: No data returned");
      }

      return {
        id: item.sourceofinquirymid,
        name: item.sourceofinquiryname,
      };
    } catch (error) {
      console.error("Error creating source of inquiry:", error);
      throw error;
    }
  },

  async updateSourceOfInquiry(
    id: number,
    sourceOfInquiry: Omit<SourceOfInquiry, "id">
  ): Promise<SourceOfInquiry> {
    try {
      const response = await axios.put(`${SOURCE_OF_INQUIRY_URL}/${id}`, {
        sourceofinquiryname: sourceOfInquiry.name,
      });

      console.log("Update Source of Inquiry Response:", response.data);

      if (response.data.status !== 'success') {
        throw new Error(response.data.message || "API returned failure");
      }

      const item = response.data.data;
      return {
        id: item.sourceofinquirymid,
        name: item.sourceofinquiryname,
      };
    } catch (error) {
      console.error("Error updating source of inquiry:", error);
      throw error;
    }
  },

  async deleteSourceOfInquiry(id: number): Promise<void> {
    try {
      const response = await axios.delete(`${SOURCE_OF_INQUIRY_URL}/${id}`);

      console.log("Delete Source of Inquiry Response:", response.data);

      if (response.data.status!=='success') {
        throw new Error(response.data.message || "API returned failure");
      }
    } catch (error) {
      console.error("Error deleting source of inquiry:", error);
      throw error;
    }
  },
};

// -------------------------
// Legacy CRUD Functions (keep for compatibility)
// -------------------------

// Get all source of inquiries
export const getSourceOfInquiries = async (): Promise<SourceOfInquiry[]> => {
  return sourceOfInquiryApi.getAllSourceOfInquiries();
};

// Add a new source of inquiry
export const addSourceOfInquiry = async (
  name: string
): Promise<SourceOfInquiry> => {
  return sourceOfInquiryApi.createSourceOfInquiry({ name });
};

// Update a source of inquiry
export const updateSourceOfInquiry = async (
  id: number,
  name: string
): Promise<SourceOfInquiry> => {
  return sourceOfInquiryApi.updateSourceOfInquiry(id, { name });
};

// Delete a source of inquiry
export const deleteSourceOfInquiry = async (id: number): Promise<void> => {
  return sourceOfInquiryApi.deleteSourceOfInquiry(id);
};
