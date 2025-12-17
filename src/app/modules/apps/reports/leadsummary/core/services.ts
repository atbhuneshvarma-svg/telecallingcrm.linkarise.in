import axios from 'axios';
import { LeadSummaryResponse, FilterState, LeadSummaryData } from './types';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const API_URL = import.meta.env.VITE_APP_THEME_API_URL;

export const fetchLeadSummary = async (filters: FilterState): Promise<LeadSummaryResponse> => {
  try {
    const response = await axios.post<LeadSummaryResponse>(
      `${API_URL}/lead/leadsummary`,
      {
        current_page: filters.page,
        per_page: filters.perPage,
        search: filters.search || '',
        date_from: filters.dateFrom || '',
        date_to: filters.dateTo || '',
        sort_by: filters.sortBy || 'user',
        sort_order: filters.sortOrder || 'asc',
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        withCredentials: false, // Important: set to false for CORS
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching lead summary:', error);
    throw error;
  }
};
export const exportToExcel = (data: LeadSummaryData[]) => {
  const exportData = data.map(item => ({
    'User': item.user,
    'Total Leads': item.total_lead,
    'Fresh Leads': item.fresh,
    'Followup': item.followup,
    'Interested': item.interested,
    'Converted': item.converted,
    'Not Interested': item.not_interested
  }));

  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Lead Summary");
  
  const wscols = [
    { wch: 20 },
    { wch: 12 },
    { wch: 12 },
    { wch: 12 },
    { wch: 12 },
    { wch: 12 },
    { wch: 15 },
  ];
  worksheet['!cols'] = wscols;
  
  const excelBuffer = XLSX.write(workbook, { 
    bookType: 'xlsx', 
    type: 'array' 
  });
  
  const blob = new Blob([excelBuffer], { 
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' 
  });
  
  saveAs(blob, `lead_summary_${new Date().toISOString().split('T')[0]}.xlsx`);
};