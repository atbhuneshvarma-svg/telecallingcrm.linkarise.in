import { useState, useEffect, useCallback } from 'react';
import { LeadSummaryData, LeadSummaryResponse, FilterState, PaginationInfo } from '../core/types';
import { fetchLeadSummary } from '../core/services';

export const useLeadSummary = () => {
  const [data, setData] = useState<LeadSummaryData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    page: 1,
    perPage: 10,
    search: '',
    sortBy: 'user',
    sortOrder: 'asc',
  });
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchLeadSummary(filters);
      
      if (response.status && response.data) {
        setData(response.data.data);
        setPagination({
          currentPage: response.data.current_page,
          totalPages: response.data.last_page,
          totalItems: response.data.total,
          from: response.data.from,
          to: response.data.to,
          perPage: response.data.per_page,
          hasNextPage: !!response.data.next_page_url,
          hasPrevPage: !!response.data.prev_page_url,
        });
      }
    } catch (err) {
      setError(err as Error);
      console.error('Error loading lead summary:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSearch = useCallback((searchTerm: string) => {
    setFilters(prev => ({ ...prev, search: searchTerm, page: 1 }));
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setFilters(prev => ({ ...prev, page }));
  }, []);

  const handlePageSizeChange = useCallback((perPage: number) => {
    setFilters(prev => ({ ...prev, perPage, page: 1 }));
  }, []);

  return {
    data,
    loading,
    error,
    filters,
    pagination,
    handleSearch,
    handlePageChange,
    handlePageSizeChange,
    refetch: loadData,
  };
};