import axios from 'axios';
import { ConvertedLeadsResponse, ConvertedLeadFilters } from '../types/lead';

const API_URL = import.meta.env.VITE_APP_API_URL;
export const CONVERTED_LEADS_URL = `${API_URL}/api/clientleads`;

export const convertedLeadService = {
  // Get converted leads with pagination and filters - POST request with body parameters
  getConvertedLeads: async (filters: ConvertedLeadFilters = {}): Promise<ConvertedLeadsResponse> => {
    // Build query parameters for GET request
    const params: Record<string, any> = {
      page: filters.page || 1,
      per_page: filters.per_page || 10,
    };

    // Add optional filters if they exist and are not 'all'
    if (filters.search) {
      params.search = filters.search;
    }
    if (filters.team && filters.team !== 'all') {
      params.team_filter = filters.team;
    }
    if (filters.user && filters.user !== 'all') {
      params.user_filter = filters.user;
    }
    if (filters.campaign && filters.campaign !== 'all') {
      params.campaign_filter = filters.campaign;
    }

    const response = await axios.get<ConvertedLeadsResponse>(CONVERTED_LEADS_URL, { params });
    return response.data;
  },

  // Alternative: If you prefer to keep using POST with body
  getConvertedLeadsPost: async (filters: ConvertedLeadFilters = {}): Promise<ConvertedLeadsResponse> => {
    const requestBody = {
      page: filters.page || 1,
      per_page: filters.per_page || 10,
      search: filters.search,
      team_filter: filters.team && filters.team !== 'all' ? filters.team : undefined,
      user_filter: filters.user && filters.user !== 'all' ? filters.user : undefined,
      campaign_filter: filters.campaign && filters.campaign !== 'all' ? filters.campaign : undefined,
    };

    const response = await axios.post<ConvertedLeadsResponse>(CONVERTED_LEADS_URL, requestBody);
    return response.data;
  },

  // Export converted leads
  exportConvertedLeads: async (filters: ConvertedLeadFilters = {}): Promise<Blob> => {
    const params: Record<string, any> = {
      page: filters.page || 1,
      per_page: filters.per_page || 10,
    };

    // Add optional filters if they exist and are not 'all'
    if (filters.search) {
      params.search = filters.search;
    }
    if (filters.team && filters.team !== 'all') {
      params.team_filter = filters.team;
    }
    if (filters.user && filters.user !== 'all') {
      params.user_filter = filters.user;
    }
    if (filters.campaign && filters.campaign !== 'all') {
      params.campaign_filter = filters.campaign;
    }

    const response = await axios.get(`${CONVERTED_LEADS_URL}/export`, {
      params,
      responseType: 'blob',
      headers: {
        'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      },
    });
    return response.data;
  },
};