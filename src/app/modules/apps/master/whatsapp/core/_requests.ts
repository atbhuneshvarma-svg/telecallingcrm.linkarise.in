// core/_requests.ts
import axios from "axios";
import { WhatsAppTemplate, PaginationInfo } from "./_models";

const API_URL = import.meta.env.VITE_APP_THEME_API_URL;

// Endpoints
const GET_TEMPLATES_URL = `${API_URL}/whatsapptamplate`;
const CREATE_TEMPLATE_URL = `${API_URL}/whatsapptamplateadd`;
const UPDATE_TEMPLATE_URL = `${API_URL}/whatsapptamplateedit`;
const DELETE_TEMPLATE_URL = `${API_URL}/whatsapptamplatedelete`;

// Helper function to convert API to UI model
const mapApiToTemplate = (apiTemplate: any): WhatsAppTemplate => {
  return {
    id: apiTemplate.wtmid,
    wtmid: apiTemplate.wtmid,
    cmpmid: apiTemplate.cmpmid,
    name: apiTemplate.template_name,
    template_name: apiTemplate.template_name,
    body: apiTemplate.message,
    message: apiTemplate.message,
    whatsappimage: apiTemplate.whatsappimage || '',
    type: apiTemplate.type || 'Text',
    image_url: apiTemplate.image_url || '',
    created_at: apiTemplate.created_at,
    updated_at: apiTemplate.updated_at,
    status: 'ACTIVE',
    category: 'UTILITY'
  }
}

export const whatsAppTemplateApi = {
  // Get templates with pagination
  async getTemplatesPaginated(page: number = 1, perPage: number = 10): Promise<{
    data: WhatsAppTemplate[];
    current_page: number;
    per_page: number;
    total_records: number;
    total_pages: number;
  }> {
    try {
      const response = await axios.get(`${GET_TEMPLATES_URL}?page=${page}&per_page=${perPage}`);
      
      console.log('API Response data:', response.data);

      if (response.data.status !== 'success') {
        throw new Error('API returned unsuccessful status');
      }

      // Check if data exists and is an array
      if (!response.data.data || !Array.isArray(response.data.data)) {
        console.warn('API response data is not an array:', response.data.data);
        return {
          data: [],
          current_page: 1,
          per_page: perPage,
          total_records: 0,
          total_pages: 1
        };
      }

      // Map API response to UI models
      const templates = response.data.data.map(mapApiToTemplate);

      return {
        data: templates,
        current_page: response.data.current_page || 1,
        per_page: response.data.per_page || perPage,
        total_records: response.data.total_records || 0,
        total_pages: response.data.total_pages || 1
      };
    } catch (error) {
      console.error('Error fetching templates:', error);
      throw error;
    }
  },

  // Create new template (accepts FormData)
  async createTemplate(formData: FormData): Promise<WhatsAppTemplate> {
    try {
      console.log('Creating template with FormData:', Array.from(formData.entries()));
      
      const response = await axios.post(CREATE_TEMPLATE_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Create template response:', response.data);

      if (response.data.status !== 'success') {
        throw new Error(response.data.message || 'API returned unsuccessful status');
      }

      // Handle different response structures
      if (response.data.data && Array.isArray(response.data.data) && response.data.data[0]) {
        return mapApiToTemplate(response.data.data[0]);
      } else if (response.data.template) {
        return mapApiToTemplate(response.data.template);
      } else {
        // Return a minimal template with the response data
        return {
          template_name: formData.get('template_name') as string || '',
          message: formData.get('message') as string || '',
          type: formData.get('type') as string || 'Text',
          whatsappimage: formData.get('whatsappimage') ? 'uploaded' : '',
          status: 'ACTIVE'
        };
      }
    } catch (error: any) {
      console.error('Error creating template:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || error.message || 'Failed to create template');
    }
  },

  // Update template (accepts FormData)
  async updateTemplate(id: number, formData: FormData): Promise<WhatsAppTemplate> {
    try {
      // Add the ID to formData if not already present
      if (!formData.has('wtmid')) {
        formData.append('wtmid', id.toString());
      }

      console.log('Updating template with FormData:', Array.from(formData.entries()));
      
      const response = await axios.post(UPDATE_TEMPLATE_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Update template response:', response.data);

      if (response.data.status !== 'success') {
        throw new Error(response.data.message || 'API returned unsuccessful status');
      }

      // Handle different response structures
      if (response.data.data && Array.isArray(response.data.data) && response.data.data[0]) {
        return mapApiToTemplate(response.data.data[0]);
      } else if (response.data.template) {
        return mapApiToTemplate(response.data.template);
      } else {
        // Return current data
        return {
          wtmid: id,
          template_name: formData.get('template_name') as string || '',
          message: formData.get('message') as string || '',
          type: formData.get('type') as string || 'Text',
          whatsappimage: formData.get('whatsappimage') ? 'updated' : '',
          status: 'ACTIVE'
        };
      }
    } catch (error: any) {
      console.error('Error updating template:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || error.message || 'Failed to update template');
    }
  },

  // Delete template
  async deleteTemplate(id: number): Promise<void> {
    try {
      console.log('Deleting template with ID:', id);
      
      // Using POST method (common for Laravel with CSRF)
      const response = await axios.post(DELETE_TEMPLATE_URL, { wtmid: id });
      
      console.log('Delete template response:', response.data);

      if (response.data.status !== 'success') {
        throw new Error(response.data.message || 'API returned unsuccessful status');
      }
    } catch (error: any) {
      console.error('Error deleting template:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || error.message || 'Failed to delete template');
    }
  }
};