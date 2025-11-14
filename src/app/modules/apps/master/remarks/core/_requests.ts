import axios from "axios";

const API_URL = import.meta.env.VITE_APP_THEME_API_URL;

// Endpoints
const GET_REMARKS_TEMPLATES_URL = `${API_URL}/remarkslist`;
const ADD_REMARKS_TEMPLATE_URL = `${API_URL}/remarks`;
const REMARKS_TEMPLATE_URL = `${API_URL}/remarks`; // for update/delete

export interface RemarksTemplate {
  id: number;
  content: string;
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
  data: RemarksTemplate[];
  current_page: number;
  per_page: number;
  total_records: number;
  total_pages: number;
}

// API Response interfaces based on your structure
interface ApiResponse {
  status: string;
  data: {
    current_page: number;
    data: any[];
    first_page_url: string;
    from: number | null;
    last_page: number;
    last_page_url: string;
    links: Array<{
      url: string | null;
      label: string;
      active: boolean;
    }>;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number | null;
    total: number;
  };
}

// Utility function to check API success
const isApiSuccess = (data: any) => data?.status === "success";

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
export const remarksTemplateApi = {
  // Get remarks templates with pagination - SERVER-SIDE PAGINATION
  async getTemplatesPaginated(
    page: number = 1,
    perPage: number = 10
  ): Promise<PaginatedResponse> {
    try {
      console.log(
        `Fetching remarks templates - Page: ${page}, Per Page: ${perPage}`
      );

      const response = await axios.get<ApiResponse>(
        `${GET_REMARKS_TEMPLATES_URL}?page=${page}&per_page=${perPage}`
      );

      console.log("Paginated Remarks Templates API Response:", response.data);

      if (!isApiSuccess(response.data)) {
        throw new Error("API returned unsuccessful status");
      }

      const apiData = response.data.data;

      return {
        data: apiData.data.map((item: any) => ({
          id: item.rmid,
          content: item.remarks,
          cmpmid: item.cmpmid,
          created_at: item.created_at,
          updated_at: item.updated_at,
        })),
        current_page: apiData.current_page,
        per_page: apiData.per_page,
        total_records: apiData.total,
        total_pages: apiData.last_page,
      };
    } catch (error) {
      console.error("Error fetching paginated remarks templates:", error);
      throw error;
    }
  },

  async createTemplate(
    template: Omit<RemarksTemplate, "id">
  ): Promise<RemarksTemplate> {
    try {
      const response = await axios.post(ADD_REMARKS_TEMPLATE_URL, {
        remarks: template.content,
        cmpmid: template.cmpmid || 37, // Default campaign ID or get from context
      });

      console.log("Create Remarks Template Response:", response.data);

      if (!isApiSuccess(response.data)) {
        throw new Error("API returned failure");
      }

      const item = response.data.data;
      return {
        id: item.rmid,
        content: template.content,
        cmpmid: template.cmpmid,
      };
    } catch (error) {
      console.error("Error creating remarks template:", error);
      throw error;
    }
  },

  async updateTemplate(
    id: number,
    template: Omit<RemarksTemplate, "id">
  ): Promise<RemarksTemplate> {
    try {
      const response = await axios.put(
        `${REMARKS_TEMPLATE_URL}/${id}`,
        {
          remarks: template.content,
          cmpmid: template.cmpmid,
        },
        {
          params: { rmid: id },
        }
      );

      console.log("Update Remarks Template Response:", response.data);

      if (!isApiSuccess(response.data)) {
        throw new Error("API returned failure");
      }

      const item = response.data.data;
      return {
        id: item.rmid,
        content: template.content,
        cmpmid: template.cmpmid,
      };
    } catch (error: any) {
      console.error(
        "Error updating remarks template:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  async deleteTemplate(id: number): Promise<void> {
    try {
      const response = await axios.delete(`${REMARKS_TEMPLATE_URL}/${id}`, {
        params: { rmid: id },
      });

      console.log("Delete Remarks Template Response:", response.data);

      if (!isApiSuccess(response.data)) {
        throw new Error("API returned failure");
      }
    } catch (error: any) {
      console.error(
        "Error deleting remarks template:",
        error.response?.data || error.message
      );
      throw error;
    }
  },
};
