// src/app/modules/apps/master/campaign/core/_request.ts
import axios from "axios";

const API_URL = import.meta.env.VITE_APP_THEME_API_URL;

// Endpoints
const GET_CAMPAIGN_URL = `${API_URL}/campaigns`;
const ADD_CAMPAIGN_URL = `${API_URL}/campaignadd`;
const CAMPAIGN_URL = `${API_URL}/campaigns`;

export interface Campaign {
  id: number;
  name: string;
  date: string;
  cmpmid?: number;
  created_at?: string;
  updated_at?: string;
}

// API Response interfaces
interface ApiResponse<T> {
  result: boolean;
  success?: false;
  message?: string;
  data: T;
  current_page: number;
  per_page: number;
  total_records: number;
  total_pages: number;
}

interface PaginatedResponse {
  data: Campaign[];
  current_page: number;
  per_page: number;
  total_records: number;
  total_pages: number;
}

// ✅ Get campaigns with pagination and search - UPDATED
export const getCampaigns = async (page: number = 1, perPage: number = 10, search: string = ''): Promise<PaginatedResponse> => {
  // Build query parameters
  const params = new URLSearchParams({
    page: page.toString(),
    per_page: perPage.toString()
  });
  
  // Add search parameter if provided
  if (search && search.trim()) {
    params.append('search', search.trim());
  }

  const response = await axios.post<ApiResponse<any[]>>(
    `${GET_CAMPAIGN_URL}?${params.toString()}`
  );
  
  console.log('Full API Response:', response.data);
  
  if (!response.data.result) {
    throw new Error(response.data.message || 'Failed to fetch campaigns');
  }

  return {
    data: response.data.data.map((item: any) => ({
      id: item.campaignmid,
      name: item.campaignname,
      date: item.campaigndate,
      cmpmid: item.cmpmid,
      created_at: item.created_at,
      updated_at: item.updated_at
    })),
    current_page: response.data.current_page,
    per_page: response.data.per_page,
    total_records: response.data.total_records,
    total_pages: response.data.total_pages
  };
};

// ✅ Add campaign
export const addCampaign = async (name: string, date?: string): Promise<Campaign> => {
  const response = await axios.post<ApiResponse<any>>(
    `${ADD_CAMPAIGN_URL}?campaignname=${encodeURIComponent(name)}&campaigndate=${encodeURIComponent(date || "")}`
  );

  if (!response.data.success == true) {
    throw new Error(response.data.message || 'Failed to add campaign');
  }

  const item = response.data.data;
  return {
    id: item.campaignmid,
    name: item.campaignname,
    date: item.campaigndate,
    cmpmid: item.cmpmid,
    created_at: item.created_at,
    updated_at: item.updated_at
  };
};

// ✅ Update campaign
export const updateCampaign = async (id: number, name: string, date?: string): Promise<Campaign> => {
  const response = await axios.put<ApiResponse<any>>(
    `${CAMPAIGN_URL}?campaignmid=${id}`, 
    { 
      campaignname: name, 
      campaigndate: date 
    }
  );

  if (!response.data.success == true) {
    throw new Error(response.data.message || 'Failed to update campaign');
  }

  const item = response.data.data;
  return {
    id: item.campaignmid,
    name: item.campaignname,
    date: item.campaigndate,
    cmpmid: item.cmpmid,
    created_at: item.created_at,
    updated_at: item.updated_at
  };
};

// ✅ Delete campaign
export const deleteCampaign = async (id: number): Promise<void> => {
  const response = await axios.delete<ApiResponse<void>>(`${CAMPAIGN_URL}?campaignmid=${id}`);
  
  if (!response.data.success == true) {
    throw new Error(response.data.message || 'Failed to delete campaign');
  }
};

// Enhanced API object with search
export const campaignApi = {
  // Get campaigns with pagination and search
  async getCampaignsPaginated(page: number = 1, perPage: number = 10, search: string = ''): Promise<PaginatedResponse> {
    try {
      // Build query parameters
      const params = new URLSearchParams({
        page: page.toString(),
        per_page: perPage.toString()
      });
      
      // Add search parameter if provided
      if (search && search.trim()) {
        params.append('search', search.trim());
      }

      const response = await axios.post<ApiResponse<any[]>>(
        `${GET_CAMPAIGN_URL}?${params.toString()}`
      );
      
      if (!response.data.result) {
        throw new Error(response.data.message || 'API returned false result');
      }

      return {
        data: response.data.data.map((item: any) => ({
          id: item.campaignmid,
          name: item.campaignname,
          date: item.campaigndate,
          cmpmid: item.cmpmid,
          created_at: item.created_at,
          updated_at: item.updated_at
        })),
        current_page: response.data.current_page,
        per_page: response.data.per_page,
        total_records: response.data.total_records,
        total_pages: response.data.total_pages
      };
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      throw error;
    }
  },

  // Get all campaigns without pagination
  async getAllCampaigns(): Promise<Campaign[]> {
    try {
      const response = await axios.post<ApiResponse<any[]>>(GET_CAMPAIGN_URL);
      
      if (!response.data.result) {
        throw new Error(response.data.message || 'API returned false result');
      }

      return response.data.data.map((item: any) => ({
        id: item.campaignmid,
        name: item.campaignname,
        date: item.campaigndate,
        cmpmid: item.cmpmid,
        created_at: item.created_at,
        updated_at: item.updated_at
      }));
    } catch (error) {
      console.error('Error fetching all campaigns:', error);
      throw error;
    }
  },

  // Create new campaign
  async createCampaign(campaign: Omit<Campaign, 'id'>): Promise<Campaign> {
    try {
      const response = await axios.post<ApiResponse<any>>(
        `${ADD_CAMPAIGN_URL}?campaignname=${encodeURIComponent(campaign.name)}&campaigndate=${encodeURIComponent(campaign.date || "")}`
      );

      if (!response.data.success == true) {
        throw new Error(response.data.message || 'API returned false result');
      }

      const item = response.data.data;
      return {
        id: item.campaignmid,
        name: item.campaignname,
        date: item.campaigndate,
        cmpmid: item.cmpmid,
        created_at: item.created_at,
        updated_at: item.updated_at
      };
    } catch (error) {
      console.error('Error creating campaign:', error);
      throw error;
    }
  },

  // Update campaign
  async updateCampaign(id: number, campaign: Omit<Campaign, 'id'>): Promise<Campaign> {
    try {
      const response = await axios.put<ApiResponse<any>>(
        `${CAMPAIGN_URL}?campaignmid=${id}`,
        {
          campaignname: campaign.name,
          campaigndate: campaign.date
        }
      );

      if (!response.data.success == true) {
        throw new Error(response.data.message || 'API returned false result');
      }

      const item = response.data.data;
      return {
        id: item.campaignmid,
        name: item.campaignname,
        date: item.campaigndate,
        cmpmid: item.cmpmid,
        created_at: item.created_at,
        updated_at: item.updated_at
      };
    } catch (error) {
      console.error('Error updating campaign:', error);
      throw error;
    }
  },

  // Delete campaign
  async deleteCampaign(id: number): Promise<void> {
    try {
      const response = await axios.delete<ApiResponse<void>>(`${CAMPAIGN_URL}?campaignmid=${id}`);
      
      if (!response.data.success == true) {
        throw new Error(response.data.message || 'API returned false result');
      }
    } catch (error) {
      console.error('Error deleting campaign:', error);
      throw error;
    }
  }
};

// Utility function to handle API errors
export const handleApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.message || 'API request failed';
  }
  return error instanceof Error ? error.message : 'Unknown error occurred';
};