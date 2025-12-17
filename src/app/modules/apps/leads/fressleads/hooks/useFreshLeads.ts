// core/hooks/useFreshLeads.ts
import { useQuery } from '@tanstack/react-query'
import { getFreshLeads } from '../core/_requests'
import { FreshLeadResponse, FreshLeadFilters } from '../core/_models'

export const useFreshLeads = (filters: FreshLeadFilters) => {
  const {
    data: leadsData,
    isLoading,
    error,
    refetch,
  } = useQuery<FreshLeadResponse, Error>({
    queryKey: ['fresh-leads', filters],
    queryFn: () => getFreshLeads(filters),
    staleTime: 2 * 60 * 1000, // Cache for 2 minutes
    refetchInterval: 5 * 60 * 1000, // Auto-refetch every 5 minutes
  })

  return {
    leads: leadsData?.data || [],
    pagination: {
      current_page: leadsData?.current_page || 1,
      total_pages: leadsData?.total_pages || 0,
      total_rows: leadsData?.total_rows || 0,
      per_page: leadsData?.per_page || filters.per_page || 10,
    },
    isLoading,
    error,
    refetch,
  }
}
