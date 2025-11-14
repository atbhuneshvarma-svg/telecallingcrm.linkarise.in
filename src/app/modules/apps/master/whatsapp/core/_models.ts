// core/_models.ts
export interface WhatsAppTemplate {
  id: number
  name: string
  category: 'UTILITY' | 'MARKETING' | 'AUTHENTICATION' | 'TRANSACTIONAL'
  language: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'DISABLED'
  header_type?: 'TEXT' | 'IMAGE' | 'VIDEO' | 'DOCUMENT'
  header_text?: string
  body: string
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
