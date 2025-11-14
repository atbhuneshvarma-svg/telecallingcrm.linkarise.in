import { useState, useEffect, useCallback } from 'react'
import { 
  TelecallerPerformance, 
  TelecallerPerformanceFilters, 
  Telecaller,
  TelecallerPerformanceResponse,
  PerformanceMetrics
} from '../core/_models'
import { getTelecallerPerformance, TelecallerPerformanceParams } from '../core/_requests'

interface UseTelecallerPerformanceReturn {
  performanceData: TelecallerPerformance[]
  telecallers: Telecaller[]
  pagination: {
    current_page: number
    per_page: number
    total_pages: number
    total_rows: number
    from: number
    to: number
  }
  performanceMetrics: PerformanceMetrics
  isLoading: boolean
  error: Error | null
  refetch: () => Promise<void>
}

export const useTelecallerPerformance = (filters: TelecallerPerformanceFilters): UseTelecallerPerformanceReturn => {
  const [performanceData, setPerformanceData] = useState<TelecallerPerformance[]>([])
  const [telecallers, setTelecallers] = useState<Telecaller[]>([])
  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: 10,
    total_pages: 1,
    total_rows: 0,
    from: 0,
    to: 0
  })
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics>({
    totalDialed: 0,
    totalAnswered: 0,
    totalInterested: 0,
    totalConfirmed: 0,
    totalTalkTime: '0:00',
    answerRate: 0,
    conversionRate: 0
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const calculateMetrics = useCallback((data: TelecallerPerformance[]): PerformanceMetrics => {
    if (!data || data.length === 0) {
      return {
        totalDialed: 0,
        totalAnswered: 0,
        totalInterested: 0,
        totalConfirmed: 0,
        totalTalkTime: '0:00',
        answerRate: 0,
        conversionRate: 0
      }
    }

    const totalDialed = data.reduce((sum, item) => sum + item.dialed, 0)
    const totalAnswered = data.reduce((sum, item) => sum + item.answered, 0)
    const totalInterested = data.reduce((sum, item) => sum + item.interested, 0)
    const totalConfirmed = data.reduce((sum, item) => sum + item.confirmed, 0)
    
    const totalMinutes = data.reduce((sum, item) => {
      if (item.talk_time === '-' || !item.talk_time) return sum
      const [hours, minutes] = item.talk_time.split(':').map(Number)
      return sum + (hours * 60) + minutes
    }, 0)
    
    const totalHours = Math.floor(totalMinutes / 60)
    const remainingMinutes = totalMinutes % 60
    const totalTalkTime = `${totalHours}:${remainingMinutes.toString().padStart(2, '0')}`

    const answerRate = totalDialed > 0 ? (totalAnswered / totalDialed) * 100 : 0
    const conversionRate = totalAnswered > 0 ? (totalInterested / totalAnswered) * 100 : 0

    return {
      totalDialed,
      totalAnswered,
      totalInterested,
      totalConfirmed,
      totalTalkTime,
      answerRate: Math.round(answerRate * 100) / 100,
      conversionRate: Math.round(conversionRate * 100) / 100
    }
  }, [])

  const refetch = useCallback(async () => {
    console.log('🔄 useTelecallerPerformance: Starting refetch with filters:', filters)
    
    setIsLoading(true)
    setError(null)
    
    try {
      const params: TelecallerPerformanceParams = {
        page: filters.page,
        per_page: filters.per_page,
        search: filters.search,
        date_from: filters.date_from,
        date_to: filters.date_to,
        usermid: filters.telecaller_id
      }

      console.log('📤 useTelecallerPerformance: Calling API with params:', params)
      const startTime = Date.now()

      const data: TelecallerPerformanceResponse = await getTelecallerPerformance(params)
      
      const endTime = Date.now()
      console.log('✅ useTelecallerPerformance: API call completed in', (endTime - startTime), 'ms')
      console.log('📄 API Response structure:', {
        hasData: !!data.rows?.data,
        dataLength: data.rows?.data?.length || 0,
        hasTelecallers: !!data.telecallers,
        telecallersLength: data.telecallers?.length || 0
      })
      
      // Transform API data
      const transformedData: TelecallerPerformance[] = data.rows.data.map(item => ({
        sr_no: item.sr,
        telecaller: item.user,
        date: item.date,
        first_call: item.start_time,
        last_call: item.end_time,
        dialed: item.dialed,
        answered: item.answered,
        interested: item.interested,
        confirmed: item.confirmed,
        talk_time: item.talktime
      }))

      console.log('📊 useTelecallerPerformance: Transformed', transformedData.length, 'records')
      console.log('📋 Sample transformed data:', transformedData.slice(0, 2))

      setPerformanceData(transformedData)
      
      // Transform telecallers data - prefer telecallers over telecallersselect
      const telecallersData = data.telecallers && data.telecallers.length > 0 
        ? data.telecallers 
        : data.telecallersselect || []
      
      const transformedTelecallers: Telecaller[] = telecallersData.map((tc: any) => ({ 
        usermid: tc.usermid, 
        username: tc.username 
      }))
      
      console.log('👥 useTelecallerPerformance: Transformed', transformedTelecallers.length, 'telecallers')
      console.log('👤 Sample telecallers:', transformedTelecallers.slice(0, 2))
      
      setTelecallers(transformedTelecallers)
      
      // Calculate performance metrics
      const metrics = calculateMetrics(transformedData)
      console.log('📈 useTelecallerPerformance: Calculated metrics:', metrics)
      setPerformanceMetrics(metrics)
      
      // Set pagination
      const paginationData = {
        current_page: data.rows.current_page || 1,
        per_page: data.rows.per_page || 10,
        total_pages: data.rows.last_page || 1,
        total_rows: data.rows.total || 0,
        from: data.rows.from || 0,
        to: data.rows.to || 0
      }
      
      console.log('🔢 useTelecallerPerformance: Pagination data:', paginationData)
      setPagination(paginationData)
      
    } catch (err) {
      console.error('❌ useTelecallerPerformance: Error fetching data:', err)
      setError(err instanceof Error ? err : new Error('Failed to fetch performance data'))
    } finally {
      console.log('🏁 useTelecallerPerformance: Fetch completed, setting loading to false')
      setIsLoading(false)
    }
  }, [filters, calculateMetrics])

  useEffect(() => {
    console.log('🎯 useTelecallerPerformance: useEffect triggered with filters:', filters)
    let isMounted = true

    const fetchData = async () => {
      if (isMounted) {
        await refetch()
      }
    }

    fetchData()

    return () => {
      isMounted = false
      console.log('🧹 useTelecallerPerformance: Component unmounted, cancelling operations')
    }
  }, [
    filters.page, 
    filters.per_page, 
    filters.search, 
    filters.date_from, 
    filters.date_to, 
    filters.telecaller_id,
    refetch
  ])

  console.log('🔄 useTelecallerPerformance: Returning state:', {
    dataLength: performanceData.length,
    telecallersLength: telecallers.length,
    isLoading,
    error: error?.message,
    pagination
  })

  return {
    performanceData,
    telecallers,
    pagination,
    performanceMetrics,
    isLoading,
    error,
    refetch,
  }
}