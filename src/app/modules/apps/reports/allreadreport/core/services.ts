// services/leadReportService.ts
import axios from 'axios';
import { LeadReportResponse, FilterState } from './types';

const API_URL =import.meta.env.VITE_APP_THEME_API_URL;

export const fetchLeadReport = async (filters: FilterState): Promise<LeadReportResponse> => {
  const response = await axios.post<LeadReportResponse>(
    `${API_URL}/lead/allleadreport`,
    {
      current_page: filters.page,
      per_page: filters.perPage,
      campaign: filters.campaign === 'All' ? '' : filters.campaign,
      status: filters.status,
      user: filters.user,
      team: filters.team,
      date_from: filters.dateFrom,
      date_to: filters.dateTo,
    }
  );
  return response.data;
};