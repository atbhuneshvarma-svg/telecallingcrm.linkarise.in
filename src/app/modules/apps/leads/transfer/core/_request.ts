import axios from "axios";
import { LeadListResponse, TransferRequest, TransferResponse } from "./types";

const API_URL = import.meta.env.VITE_APP_THEME_API_URL;

export const leadTransferApi = {
  /**
   * ✅ Get all leads data for transfer page WITH PAGINATION
   */
  getLeadsForTransfer: async (page: number = 1, perPage: number = 10): Promise<LeadListResponse> => {
    try {
      const token = localStorage.getItem("kt-auth-react-v");
      if (!token) {
        throw new Error("Please login again");
      }

      // Add pagination parameters to the request
      const payload = {
        page: page,
        per_page: perPage
      };

      const response = await axios.post<LeadListResponse>(
        `${API_URL}/leadtrsanfarlist`,
        payload, // Send pagination parameters
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("✅ Leads transfer data:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("❌ Error fetching leads:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("kt-auth-react-v");
        window.location.href = "/auth/login";
      }
      throw error;
    }
  },

  /**
   * ✅ Transfer selected leads - UPDATED FOR PAYLOAD STRUCTURE
   */
  transferLeads: async (
    transferData: TransferRequest
  ): Promise<TransferResponse> => {
    const token = localStorage.getItem("kt-auth-react-v");

    // Transform data to match API payload structure
    const payload = {
      lead_ids: transferData.leadIds.join(","), // Convert array to comma-separated string
      user_id: transferData.targetUserId,
      team_id: transferData.targetTeamId, // Add team_id if needed
    };

    console.log("📤 Transfer payload:", payload);

    const response = await axios.post<TransferResponse>(
      `${API_URL}/leadtransfer/allocate`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  },

  getBulkTransferCount: async (filters: {
    fromUser?: string;
    fromStatus?: string;
    fromCampaign?: string;
  }): Promise<{ count: number }> => {
    try {
      const token = localStorage.getItem("kt-auth-react-v");
      if (!token) {
        throw new Error("Please login again");
      }

      const response = await axios.post<{ count: number }>(
        `${API_URL}/leadtransfer/bulktransfer/count`,
        filters,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      console.error("❌ Error fetching bulk transfer count:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("kt-auth-react-v");
        window.location.href = "/auth/login";
      }
      throw error;
    }
  },

  /**
   * ✅ Execute bulk transfer
   */
  bulkTransfer: async (transferData: {
    fromUser?: string;
    fromStatus?: string;
    fromCampaign?: string;
    toUser: number;
  }): Promise<{
    result: boolean;
    message: string;
    transferred_count: number;
  }> => {
    try {
      const token = localStorage.getItem("kt-auth-react-v");
      if (!token) {
        throw new Error("Please login again");
      }

      const response = await axios.post<{
        result: boolean;
        message: string;
        transferred_count: number;
      }>(`${API_URL}/leadtransfer/bulktransfer/save`, transferData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      console.error("❌ Error executing bulk transfer:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("kt-auth-react-v");
        window.location.href = "/auth/login";
      }
      throw error;
    }
  },

  /**
   * ✅ Delete selected leads
   */
  deleteLeads: async (leadIds: number[]) => {
    const token = localStorage.getItem("kt-auth-react-v");

    // Build query string correctly
    const query = leadIds.map((id) => `lead_ids[]=${id}`).join("&");

    const response = await axios.post(
      `${API_URL}/leadtransfer/multi-delete?${query}`,
      {}, // empty body (you must pass something in POST)
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  },
};