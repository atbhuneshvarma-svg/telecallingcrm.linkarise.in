import { useState, useEffect, useRef } from 'react';
import { ActivityLogsResponse, ActivityLogsFilters } from '../core/_models';
import { activityLogsApi } from '../core/_request';

interface UseActivityLogsReturn {
  logs: ActivityLogsResponse | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useActivityLogs = (filters: ActivityLogsFilters): UseActivityLogsReturn => {
  const [logs, setLogs] = useState<ActivityLogsResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const previousFilters = useRef<ActivityLogsFilters>();

  const fetchLogs = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await activityLogsApi.getActivityLogs(filters);
      setLogs(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch activity logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch if filters actually changed
    const filtersChanged = JSON.stringify(previousFilters.current) !== JSON.stringify(filters);
    
    if (filtersChanged) {
      previousFilters.current = filters;
      fetchLogs();
    }
  }, [filters]);

  const refetch = () => {
    fetchLogs();
  };

  return {
    logs,
    loading,
    error,
    refetch,
  };
};