// core/_request.ts
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

export const getLeadFollowupList = async (
  page: number = 1,
  perPage: number = 10,
  followupDate: string = '',
  user: string = 'All',
  campaign: string = 'All',
  status: string = 'All'
) => {
  // Prepare filters exactly as they appear in URL
  const requestData: any = {
    page,
    per_page: perPage,
  };

  // Add filters only if they have values (not 'All')
  if (followupDate) {
    requestData.followup_date = followupDate;
  }
  
  if (user !== 'All') {
    // Send numeric user ID (usermid) instead of username
    requestData.user_filter = user; // This should be numeric ID like "69"
  }
  
  if (campaign !== 'All') {
    // Send numeric campaign ID instead of campaign name
    requestData.campaign_filter = campaign; // This should be numeric ID like "49"
  }
  
  if (status !== 'All') {
    requestData.status_filter = status; // Status name like "Warm"
  }

  // Add empty team_filter if needed by API
  requestData.team_filter = '';

  console.log('API Request Data:', requestData); // For debugging

  const response = await axios.post(GET_FOLLOWUP_LIST_URL, requestData);
  return response.data;
};