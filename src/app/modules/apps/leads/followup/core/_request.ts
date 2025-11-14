import axios from 'axios'
import { FollowupLead } from './_models'

const API_URL = import.meta.env.VITE_APP_THEME_API_URL
const GET_FOLLOWUP_LIST_URL = `${API_URL}/leadfollowup`

interface FollowupResponse {
  result: boolean
  message: string
  data: FollowupLead[]
  current_page: number
  per_page: number
  total_records: number
  total_pages: number
}

export const getLeadFollowupList = async (page: number = 1, perPage: number = 10) => {
  const response = await axios.post<FollowupResponse>(GET_FOLLOWUP_LIST_URL, {
    page,
    per_page: perPage,
  })
  return response.data
}
