import axios from 'axios'
import { TelecallerPerformanceResponse } from './_models'

const API_URL = import.meta.env.VITE_APP_THEME_API_URL
const GET_TELECALLER_PERFORMANCE_URL = `${API_URL}/tellecallreport`

export interface TelecallerPerformanceParams {
  page?: number
  per_page?: number
  search?: string
  date_from?: string
  date_to?: string
  usermid?: number
}

export const getTelecallerPerformance = async (params: TelecallerPerformanceParams = {}): Promise<TelecallerPerformanceResponse> => {
  const response = await axios.post(GET_TELECALLER_PERFORMANCE_URL, params) // Pass params as request body
  
  return response.data
}

// Get today's performance by default
export const getTodayTelecallerPerformance = async (page: number = 1, perPage: number = 10): Promise<TelecallerPerformanceResponse> => {
  const today = new Date().toISOString().split('T')[0]
  
  return getTelecallerPerformance({
    page,
    per_page: perPage,
    date_from: today,
    date_to: today,
  })
}

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
  })
}