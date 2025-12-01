// src/app/modules/apps/leads/hooks/useStatusWiseLeads.ts
import { useState, useEffect, useCallback } from 'react'
import { LeadStatusData, StatusWiseLeadsParams, getStatusWiseLeads } from '../core/_requests'

interface UseStatusWiseLeadsReturn {
  leads: LeadStatusData[]
  isLoading: boolean
  error: Error | null
  pagination: {
    current_page: number
    per_page: number
    total: number
    from: number
    to: number
    total_pages: number
  }
  refetch: () => Promise<void>
}

export const useStatusWiseLeads = (
  params: StatusWiseLeadsParams,
  autoFetch: boolean = true
): UseStatusWiseLeadsReturn => {
  const [leads, setLeads] = useState<LeadStatusData[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: 10,
    total: 0,
    from: 0,
    to: 0,
    total_pages: 1,
  })

  const fetchLeads = useCallback(async () => {
    if (params.leadmids.length === 0) {
      setLeads([])
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await getStatusWiseLeads(params)

      if (response.status && response.data) {
        setLeads(response.data.data)
        setPagination({
          current_page: response.data.current_page,
          per_page: response.data.per_page,
          total: response.data.total,
          from: response.data.from,
          to: response.data.to,
          total_pages: response.data.last_page,
        })
      } else {
        setLeads([])
      }
    } catch (err) {
      console.error('Error in useStatusWiseLeads:', err)
      setError(err instanceof Error ? err : new Error('Failed to fetch leads'))
      setLeads([])
    } finally {
      setIsLoading(false)
    }
  }, [params])

  useEffect(() => {
    if (autoFetch) {
      fetchLeads()
    }
  }, [fetchLeads, autoFetch])

  return {
    leads,
    isLoading,
    error,
    pagination,
    refetch: fetchLeads,
  }
}