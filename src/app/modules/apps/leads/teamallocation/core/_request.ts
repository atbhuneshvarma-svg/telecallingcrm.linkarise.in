import axios from "axios";

const API_URL = import.meta.env.VITE_APP_THEME_API_URL;

export const leadTransferApi = {
  /**
   * Get teams for bulk allocation (to show in the modal)
   */
  getBulkAllocateTeams: async () => {
    try {
      const token = localStorage.getItem("kt-auth-react-v");
      if (!token) {
        throw new Error("Please login again");
      }

      const response = await axios.get(
        `${API_URL}/leadallocation/bulkallocateteam`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("✅ Teams for bulk allocation:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("❌ Error fetching teams:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("kt-auth-react-v");
        window.location.href = "/auth/login";
      }
      throw error;
    }
  },

  /**
   * Bulk allocate leads to teams
   * Updated to match correct API payload structure
   */
  bulkAllocateToTeams: async (payload: {
    campaignmid: number;
    lead_ids: number[];
    team_ids: number[];
  }) => {
    try {
      const token = localStorage.getItem("kt-auth-react-v");
      if (!token) {
        throw new Error("Please login again");
      }

      // Format the payload according to the API requirements
      const formattedPayload = {
        campaignmid: payload.campaignmid,
        lead_ids: payload.lead_ids.join(","), // Convert array to comma-separated string
        team_ids: payload.team_ids // Keep as array
      };

      console.log("📤 Bulk allocate payload:", formattedPayload);

      const response = await axios.post(
        `${API_URL}/leadallocation/bulkallocateteamstore`,
        formattedPayload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      console.log("✅ Bulk allocation response:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("❌ Error bulk allocating to teams:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("kt-auth-react-v");
        window.location.href = "/auth/login";
      }
      
      // Provide more specific error messages
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error("Failed to allocate leads to teams. Please try again.");
      }
    }
  },

  // ... rest of your existing methods ...
};