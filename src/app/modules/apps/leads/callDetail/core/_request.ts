import axios from 'axios'
import { CallDetail } from './_models'

const API_URL = import.meta.env.VITE_APP_THEME_API_URL
// Use the correct endpoint
const CALL_DETAILS_URL = `${API_URL}/calldetails`

export const callDetailsApi = {
  getPaginated: async (params: {
    page?: number;
    per_page?: number;
    daterange?: string;
    campaignid?: string;
    usermid?: string;
    status?: string;
    search?: string;
  }) => {
    // Build query parameters
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.per_page) queryParams.append('per_page', params.per_page.toString());
    if (params.daterange) queryParams.append('daterange', params.daterange);
    if (params.campaignid) queryParams.append('campaignid', params.campaignid);
    if (params.usermid) queryParams.append('usermid', params.usermid);
    if (params.status) queryParams.append('status', params.status || '');
    if (params.search) queryParams.append('search', params.search);
    
    // Note: Your API doesn't seem to need 'submit=Submit' parameter
    // queryParams.append('submit', 'Submit');
    
    const url = `${CALL_DETAILS_URL}?${queryParams.toString()}`;
    
    console.log('🔄 API Request URL:', url);
    
    try {
      const response = await axios.get(url, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      });
      
      console.log('✅ API Response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ API Error:', {
        url: url,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      });
      throw error;
    }
  },
}