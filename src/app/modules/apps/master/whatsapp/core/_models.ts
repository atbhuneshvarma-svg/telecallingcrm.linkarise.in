// core/_models.ts

// For API response
export interface WhatsAppTemplateApi {
  wtmid: number
  cmpmid: number  // Add this
  template_name: string
  message: string
  whatsappimage: string
  type: string
  created_at: string
  updated_at: string
  image_url: string
}

// For form/UI (simplified version)
export interface WhatsAppTemplate {
  id?: number  // Changed to optional
  wtmid?: number
  cmpmid?: number  // Add this
  name?: string
  template_name?: string
  body?: string
  message?: string
  whatsappimage?: string
  type?: string
  image_url?: string
  status?: string
  category?: string
  language?: string
  header_type?: string
  header_text?: string
  footer?: string
  buttons?: WhatsAppTemplateButton[]
  created_at?: string
  updated_at?: string
}

export interface WhatsAppTemplateButton {
  type: 'QUICK_REPLY' | 'URL' | 'PHONE_NUMBER'
  text: string
  url?: string
  phone_number?: string
}

export interface PaginationInfo {
  current_page: number
  per_page: number
  total_records: number
  total_pages: number
}

export interface WhatsAppTemplatesListProps {
  templates: WhatsAppTemplate[]
  onEdit: (template: WhatsAppTemplate) => void
  onDelete: (id: number) => void
}

// API response interface
export interface WhatsAppTemplatesApiResponse {
  status: string
  data: WhatsAppTemplateApi[]
  current_page: number
  per_page: number
  total_records: number
  total_pages: number
}

// Helper function to convert API to UI model
export const mapApiToTemplate = (apiTemplate: WhatsAppTemplateApi): WhatsAppTemplate => {
  return {
    id: apiTemplate.wtmid,
    wtmid: apiTemplate.wtmid,
    cmpmid: apiTemplate.cmpmid,  // Add this
    name: apiTemplate.template_name,
    template_name: apiTemplate.template_name,
    body: apiTemplate.message,
    message: apiTemplate.message,
    whatsappimage: apiTemplate.whatsappimage,
    type: apiTemplate.type,
    image_url: apiTemplate.image_url,
    created_at: apiTemplate.created_at,
    updated_at: apiTemplate.updated_at,
    status: 'ACTIVE',
    category: 'UTILITY'
  }
}