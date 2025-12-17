// src/app/modules/apps/reports/allleadreport/hooks/useLeadReport.ts
import { useQuery } from '@tanstack/react-query';
import { fetchLeadReport } from '../core/services';
import { FilterState } from '../core/types';

export const useLeadReport = (filters: FilterState) => {
  return useQuery({
    queryKey: ['leadReport', filters],
    queryFn: () => fetchLeadReport(filters),
    placeholderData: (previousData) => previousData, // This replaces keepPreviousData
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
};