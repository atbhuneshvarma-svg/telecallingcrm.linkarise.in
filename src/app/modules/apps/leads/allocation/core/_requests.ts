import axios from 'axios'
import { Lead, AllocationData } from './_models'

const API_URL = import.meta.env.VITE_APP_THEME_API_URL

export const leadApi = {
  /**
   * ✅ Get all leads for allocation page (no pagination)
   */
  getLeadsForAllocation: async (): Promise<Lead[]> => {
    const response = await axios.post<{ result: boolean; data: Lead[] }>(`${API_URL}/leadallocation`)
    console.log(response.data.data);
    
    return response.data.data.map(lead => ({ ...lead, isSelected: false }))
  },

  /**
   * ✅ Allocate selected leads to a user
   */
  allocateLeads: async (
    allocationData: AllocationData
  ): Promise<{ result: boolean; message: string }> => {
    const response = await axios.post<{ result: boolean; message: string }>(
      `${API_URL}/leads/allocate`,
      allocationData
    )
    return response.data
  },

  /**
   * ✅ Delete selected leads
   */
  deleteLeads: async (leadIds: number[]): Promise<{ result: boolean; message: string }> => {
    const response = await axios.post<{ result: boolean; message: string }>(
      `${API_URL}/leads/delete-bulk`,
      { leadIds }
    )
    return response.data
  },
  /**
   * ✅ Import leads from a file
   */
  importLeads: async (file: File): Promise<{ result: boolean; message: string }> => {
    try {
      console.log('🔍 [API] Starting import process...');
      console.log('📁 File details:', {
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified
      });

      const formData = new FormData()
      formData.append('file', file)
      
      // Log FormData contents (for debugging)
      console.log('📦 FormData entries:');
      for (let [key, value] of formData.entries()) {
        console.log(`  ${key}:`, value);
      }

      console.log('🌐 Sending request to:', `${API_URL}/leadallocation/import`);
      
      const response = await axios.post<{ result: boolean; message: string }>(
        `${API_URL}/leadallocation/importstore`,
        formData,
        {
          headers: { 
            'Content-Type': 'multipart/form-data',
          },
          timeout: 60000, // 60 second timeout for large files
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              console.log(`📤 Upload Progress: ${percentCompleted}%`);
            }
          }
        }
      )
      
      console.log('✅ API Response received:', response.data);
      console.log('📊 Response status:', response.status);
      console.log('🔑 Response headers:', response.headers);
      
      return response.data
    } catch (error: any) {
      console.error('❌ API Import Error Details:', error);
      
      // Detailed error analysis
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('🚨 Server Response Error:', {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data,
          headers: error.response.headers
        });
        
        const serverMessage = error.response.data?.message || 
                             error.response.data?.error || 
                             error.response.statusText;
        throw new Error(serverMessage || `Server error (${error.response.status})`);
      } else if (error.request) {
        // The request was made but no response was received
        console.error('🚨 No Response Received:', error.request);
        throw new Error('No response from server. Please check: 1) API endpoint, 2) CORS settings, 3) Network connection');
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('🚨 Request Setup Error:', error.message);
        throw new Error(`Request failed: ${error.message}`);
      }
    }
  },
}
