// core/_requests.ts
import axios from "axios";
import { WhatsAppTemplate, PaginationInfo } from "./_models";

const API_URL = import.meta.env.VITE_APP_THEME_API_URL;

// Endpoints
const GET_TEMPLATES_URL = `${API_URL}/whatsapptamplate`;
const CREATE_TEMPLATE_URL = `${API_URL}/whatsapptamplateadd`;
const EDIT_TEMPLATE_URL = `${API_URL}/whatsapp-template-edit`;
const DELETE_TEMPLATE_URL = `${API_URL}/whatsapp-template-delete`;

// API Response interfaces based on your actual response
interface ApiResponse<T> {
  status: string;
  data: T;
  message?: string; // Added optional message property
}

interface PaginatedResponseData {
  current_page: number;
  data: any[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: any[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

interface PaginatedResponse {
  data: WhatsAppTemplate[];
  current_page: number;
  per_page: number;
  total_records: number;
  total_pages: number;
}

// Enhanced API object
export const whatsAppTemplateApi = {
  // Get templates with pagination
  async getTemplatesPaginated(page: number = 1, perPage: number = 10): Promise<PaginatedResponse> {
    try {
      const response = await axios.get<ApiResponse<PaginatedResponseData>>(
        `${GET_TEMPLATES_URL}?page=${page}&per_page=${perPage}`
      );
      
      console.log('API Response:', response.data);

      if (response.data.status !== 'success') {
        throw new Error(response.data.message || 'API returned unsuccessful status');
      }

      const responseData = response.data.data;

      return {
        data: responseData.data.map((item: any) => ({
          id: item.wtmid,
          name: item.template_name,
          category: item.category || 'UTILITY',
          language: item.language || 'en',
          status: item.status || 'PENDING',
          header_type: item.header_type || 'TEXT',
          header_text: item.header_text || '',
          body: item.message || item.body || '',
          footer: item.footer || '',
          buttons: item.buttons || [],
          created_at: item.created_at,
          updated_at: item.updated_at
        })),
        current_page: responseData.current_page,
        per_page: responseData.per_page,
        total_records: responseData.total,
        total_pages: responseData.last_page
      };
    } catch (error) {
      console.error('Error fetching templates:', error);
      throw error;
    }
  },

  // Create new template
  async createTemplate(template: Omit<WhatsAppTemplate, 'id'>): Promise<WhatsAppTemplate> {
    try {
      const response = await axios.post<ApiResponse<any>>(
        CREATE_TEMPLATE_URL,
        {
          template_name: template.name,
          category: template.category,
          language: template.language,
          status: template.status,
          header_type: template.header_type,
          header_text: template.header_text,
          message: template.body, // Using 'message' field as per your API
          footer: template.footer,
          buttons: template.buttons
        }
      );

      console.log('Create Template Response:', response.data);

      if (response.data.status !== 'success') {
        throw new Error(response.data.message || 'API returned unsuccessful status');
      }

      const item = response.data.data;
      return {
        id: item.wtmid || item.template_id,
        name: item.template_name,
        category: item.category,
        language: item.language,
        status: item.status,
        header_type: item.header_type,
        header_text: item.header_text,
        body: item.message || item.body,
        footer: item.footer,
        buttons: item.buttons || [],
        created_at: item.created_at,
        updated_at: item.updated_at
      };
    } catch (error) {
      console.error('Error creating template:', error);
      throw error;
    }
  },

  // Update template
  async updateTemplate(id: number, template: Omit<WhatsAppTemplate, 'id'>): Promise<WhatsAppTemplate> {
    try {
      const response = await axios.put<ApiResponse<any>>(
        `${EDIT_TEMPLATE_URL}?template_id=${id}`,
        {
          template_name: template.name,
          category: template.category,
          language: template.language,
          status: template.status,
          header_type: template.header_type,
          header_text: template.header_text,
          message: template.body, // Using 'message' field as per your API
          footer: template.footer,
          buttons: template.buttons
        }
      );

      console.log('Update Template Response:', response.data);

      if (response.data.status !== 'success') {
        throw new Error(response.data.message || 'API returned unsuccessful status');
      }

      const item = response.data.data;
      return {
        id: item.wtmid || item.template_id,
        name: item.template_name,
        category: item.category,
        language: item.language,
        status: item.status,
        header_type: item.header_type,
        header_text: item.header_text,
        body: item.message || item.body,
        footer: item.footer,
        buttons: item.buttons || [],
        created_at: item.created_at,
        updated_at: item.updated_at
      };
    } catch (error) {
      console.error('Error updating template:', error);
      throw error;
    }
  },

  // Delete template
  async deleteTemplate(id: number): Promise<void> {
    try {
      const response = await axios.delete<ApiResponse<{ message?: string }>>(
        `${DELETE_TEMPLATE_URL}?template_id=${id}`
      );
      
      console.log('Delete Template Response:', response.data);

      if (response.data.status !== 'success') {
        throw new Error(response.data.message || 'API returned unsuccessful status');
      }
    } catch (error) {
      console.error('Error deleting template:', error);
      throw error;
    }
  }
};