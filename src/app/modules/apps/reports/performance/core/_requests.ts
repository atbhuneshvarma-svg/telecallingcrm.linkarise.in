import axios from "axios";
import { TelecallerPerformanceResponse } from "./_models";

const API_URL = import.meta.env.VITE_APP_THEME_API_URL;
const GET_TELECALLER_PERFORMANCE_URL = `${API_URL}/tellecallreport`;

export interface TelecallerPerformanceParams {
  page?: number;
  per_page?: number;
  search?: string;
  date_from?: string;
  date_to?: string;
  usermid?: number;
}

export const getTelecallerPerformance = async (
  params: TelecallerPerformanceParams = {}
): Promise<TelecallerPerformanceResponse> => {
  // Build query parameters according to your API URL structure
  const queryParams = new URLSearchParams();

  if (params.page) queryParams.append("page", params.page.toString());
  if (params.per_page)
    queryParams.append("per_page", params.per_page.toString());
  if (params.search) queryParams.append("search", params.search);

  // Handle date range - format as "26-11-2025+-+26-11-2025"
  if (params.date_from && params.date_to) {
    const formatDateForAPI = (dateString: string) => {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    };

    const daterange = `${formatDateForAPI(
      params.date_from
    )}+-+${formatDateForAPI(params.date_to)}`;
    queryParams.append("daterange", daterange);
  }

  if (params.usermid) queryParams.append("usermid", params.usermid.toString());

  const url = `${GET_TELECALLER_PERFORMANCE_URL}?${queryParams.toString()}`;
  console.log("API URL:", url); // For debugging

  const response = await axios.get(url);
  return response.data;
};

// Get today's performance by default
export const getTodayTelecallerPerformance = async (
  page: number = 1,
  perPage: number = 10
): Promise<TelecallerPerformanceResponse> => {
  const today = new Date().toISOString().split("T")[0];

  return getTelecallerPerformance({
    page,
    per_page: perPage,
    date_from: today,
    date_to: today,
  });
};

// Get performance for date range
export const getTelecallerPerformanceByDateRange = async (
  startDate: string,
  endDate: string,
  page: number = 1,
  perPage: number = 10
): Promise<TelecallerPerformanceResponse> => {
  return getTelecallerPerformance({
    page,
    per_page: perPage,
    date_from: startDate,
    date_to: endDate,
  });
};
