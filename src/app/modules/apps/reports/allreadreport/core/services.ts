// services/leadReportService.ts
import axios from 'axios';
import { LeadReportResponse, FilterState } from './types';

const API_URL = import.meta.env.VITE_APP_THEME_API_URL;

export const fetchLeadReport = async (filters: FilterState): Promise<LeadReportResponse> => {
  // Map component field names to API parameter names
  const requestBody: any = {
    current_page: filters.page,
    per_page: filters.perPage,
  };

  // Map campaign -> campaign_filter
  if (filters.campaignmid && filters.campaignmid !== 'All') {
    requestBody.campaign_filter = filters.campaignmid;
  }
  
  // Map team -> team_filter
  if (filters.tmid) {
    requestBody.team_filter = filters.tmid;
  }
  
  // Map user -> user_filter
  if (filters.usermid) {
    requestBody.user_filter = filters.usermid;
  }
  
  // Map status -> status_filter
  if (filters.status) {
    requestBody.status_filter = filters.status;
  }
  
  // Map dateFrom -> date_from
  if (filters.dateFrom && filters.dateTo) {
    requestBody.date_from = filters.dateFrom;
    requestBody.date_to = filters.dateTo;
  }

  console.log('API Request:', {
    url: `${API_URL}/lead/allleadreport`,
    body: requestBody
  });

  const response = await axios.post<LeadReportResponse>(
    `${API_URL}/lead/allleadreport`,
    requestBody,
    {
      headers: {
        'Content-Type': 'application/json',
      }
    }
  );
  
  return response.data;
};