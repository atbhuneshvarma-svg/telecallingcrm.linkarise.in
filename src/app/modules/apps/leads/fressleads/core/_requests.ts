// src/app/modules/apps/leads/fressleads/core/_requests.ts
import axios from 'axios'
import { FreshLeadResponse, FreshLeadFilters } from './_models'

const API_URL = import.meta.env.VITE_APP_THEME_API_URL
const GET_FRESH_LEADS_URL = `${API_URL}/fressleads`

export const getFreshLeads = async (filters: FreshLeadFilters) => {
  const { page, per_page, usermid, campaignmid, statusname, search } = filters

  // ✅ Build query params
  const params: Record<string, any> = {
    page: page ?? 1,
    per_page: per_page ?? 10,
  }

  if (usermid) params.user_filter = usermid
  if (campaignmid) params.campaign_filter = campaignmid
  if (statusname) params.status_filter = statusname
  if (search) params.search = search

  // ✅ Correct: send as query params (not body)
  const response = await axios.get<FreshLeadResponse>(GET_FRESH_LEADS_URL, { params })

  return response.data
}
