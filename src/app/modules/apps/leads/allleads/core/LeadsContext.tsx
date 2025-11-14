import React, { createContext, useContext, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { campaignApi } from '../../../master/campaings/core/_request'
import { sourceOfInquiryApi } from '../../../master/sourceOFinquiry/core/_request'
import { purposeApi } from '../../../master/purpose/core/_request'
import { activityApi } from '../../../master/activity/core/_request'
import { statusApi } from '../../../master/status/core/_request'
import { userApi } from '../../../master/user-management/core/_requests'

interface Campaign {
  id: number
  name: string
}

interface Source {
  id: number
  name: string
}

interface Purpose {
  id: number
  name: string
}

interface Activity {
  activitymid: number
  activityname: string
}

interface Status {
  statusmid: number
  statusname: string
  statuscolor: string
}

interface User {
  usermid: number
  username: string
}

interface Dropdowns {
  campaigns: Campaign[]
  sources: Source[]
  purposes: Purpose[]
  activities: Activity[]
  statuses: Status[]
  users: User[]
}

interface LeadsContextType {
  dropdowns: Dropdowns
  loading: boolean
  error: Error | null
}

const LeadsContext = createContext<LeadsContextType | undefined>(undefined)

interface LeadsProviderProps {
  children: React.ReactNode
}

// ✅ Safe extractor function for API data
const extractData = (response: any, fallback: any[] = []): any[] => {
  if (Array.isArray(response)) return response
  if (response?.data && Array.isArray(response.data)) return response.data
  if (response?.result && Array.isArray(response.data)) return response.data
  return fallback
}

// ✅ Safe user fetcher
const fetchUsers = async (): Promise<any[]> => {
  try {
    const response = await userApi.getUsersPaginated(1, 1000)
    return response.data || []
  } catch (error) {
    console.error('Error fetching users:', error)
    return []
  }
}

export const LeadsProvider: React.FC<LeadsProviderProps> = ({ children }) => {
  // ✅ Check login status
  const token = localStorage.getItem('kt-auth-react-v')
  const isAuthenticated = !!token

  console.log('🧩 LeadsProvider mount | Authenticated:', isAuthenticated)

  // ✅ Campaigns
  const { data: campaigns, isLoading: campaignsLoading, error: campaignsError } = useQuery({
    queryKey: ['campaigns'],
    queryFn: () => campaignApi.getAllCampaigns(),
    staleTime: 5 * 60 * 1000,
    enabled: isAuthenticated,
  })

  // ✅ Sources
  const { data: sources, isLoading: sourcesLoading, error: sourcesError } = useQuery({
    queryKey: ['sources'],
    queryFn: () => sourceOfInquiryApi.getAllSourceOfInquiries(),
    staleTime: 5 * 60 * 1000,
    enabled: isAuthenticated,
  })

  // ✅ Purposes
  const { data: purposes, isLoading: purposesLoading, error: purposesError } = useQuery({
    queryKey: ['purposes'],
    queryFn: () => purposeApi.getAllPurposes(),
    staleTime: 5 * 60 * 1000,
    enabled: isAuthenticated,
  })

  // ✅ Activities
  const { data: activities, isLoading: activitiesLoading, error: activitiesError } = useQuery({
    queryKey: ['activities'],
    queryFn: () => activityApi.getAllActivities(),
    staleTime: 5 * 60 * 1000,
    enabled: isAuthenticated,
  })

  // ✅ Statuses
  const { data: statusesResponse, isLoading: statusesLoading, error: statusesError } = useQuery({
    queryKey: ['statuses'],
    queryFn: async () => {
      console.log('🔄 Fetching statuses from API...')
      const response = await statusApi.getAllStatuses()
      return response
    },
    staleTime: 5 * 60 * 1000,
    enabled: isAuthenticated,
  })

  // ✅ Users
  const { data: users, isLoading: usersLoading, error: usersError } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
    staleTime: 5 * 60 * 1000,
    enabled: isAuthenticated,
  })

  const loading =
    campaignsLoading ||
    sourcesLoading ||
    purposesLoading ||
    activitiesLoading ||
    statusesLoading ||
    usersLoading

  const error =
    campaignsError ||
    sourcesError ||
    purposesError ||
    activitiesError ||
    statusesError ||
    usersError

  // ✅ Prepare context value
  const value = useMemo(() => {
    if (!isAuthenticated) {
      console.log('🚫 Not authenticated — skipping dropdown data setup.')
      return {
        dropdowns: {
          campaigns: [],
          sources: [],
          purposes: [],
          activities: [],
          statuses: [],
          users: [],
        },
        loading: false,
        error: null,
      }
    }

    const statusResponse = statusesResponse as any
    let rawStatusData: any[] = []

    if (Array.isArray(statusResponse)) rawStatusData = statusResponse
    else if (statusResponse?.data && Array.isArray(statusResponse.data))
      rawStatusData = statusResponse.data
    else if (statusResponse?.result && Array.isArray(statusResponse.data))
      rawStatusData = statusResponse.data

    const transformedStatuses = rawStatusData.map((item: any, index: number) => {
      const statusmid = parseInt(String(item?.id), 10)
      return {
        statusmid: isNaN(statusmid) ? 0 : statusmid,
        statusname: item?.name || `Status ${index + 1}`,
        statuscolor: item?.color || '#6c757d',
      }
    })

    const dropdownsValue: Dropdowns = {
      campaigns: extractData(campaigns),
      sources: extractData(sources),
      purposes: extractData(purposes),
      activities:
        extractData(activities).map((item: any) => ({
          activitymid: Number(item?.activitymid) || 0,
          activityname: item?.activityname || item?.name || 'Unnamed Activity',
        })) || [],
      statuses: transformedStatuses,
      users: extractData(users),
    }

    return {
      dropdowns: dropdownsValue,
      loading,
      error,
    }
  }, [
    campaigns,
    sources,
    purposes,
    activities,
    statusesResponse,
    users,
    loading,
    error,
    isAuthenticated,
  ])

  return <LeadsContext.Provider value={value}>{children}</LeadsContext.Provider>
}

export const useLeads = (): LeadsContextType => {
  const context = useContext(LeadsContext)
  if (context === undefined) {
    throw new Error('useLeads must be used within a LeadsProvider')
  }
  return context
}

export const useStatuses = () => {
  const { dropdowns, loading, error } = useLeads()
  return {
    statuses: dropdowns.statuses,
    loading,
    error,
  }
}
