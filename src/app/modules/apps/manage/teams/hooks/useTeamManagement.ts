// src/app/modules/apps/manage/teams/hooks/useTeamManagement.ts
import { useState, useEffect } from 'react';
import { Team, TeamsResponse } from '../core/_models';
import { teamRequests } from '../core/_requests';

interface UseTeamManagementReturn {
  teams: Team[];
  loading: boolean;
  error: string | null;
  totalRecords: number;
  currentPage: number;
  totalPages: number;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  setCurrentPage: (page: number) => void;
  refetch: () => Promise<void>;
  deleteTeam: (id: number) => Promise<void>;
}

export const useTeamManagement = (itemsPerPage: number = 10): UseTeamManagementReturn => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const fetchTeams = async (page: number = 1, search: string = ''): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      const data: TeamsResponse = await teamRequests.getTeams(page, itemsPerPage, search);
      
      if (data.result) {
        setTeams(data.data);
        setTotalRecords(data.total_records);
        setTotalPages(data.total_pages);
        setCurrentPage(data.current_page);
      } else {
        throw new Error('Failed to fetch teams');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams(currentPage, searchTerm);
  }, [currentPage]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1);
      fetchTeams(1, searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const deleteTeam = async (id: number): Promise<void> => {
    try {
      await teamRequests.deleteTeam(id);
      await fetchTeams(currentPage, searchTerm); // Refresh the list
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete team');
      throw err;
    }
  };

  const refetch = async (): Promise<void> => {
    await fetchTeams(currentPage, searchTerm);
  };

  return {
    teams,
    loading,
    error,
    totalRecords,
    currentPage,
    totalPages,
    searchTerm,
    setSearchTerm,
    setCurrentPage,
    refetch,
    deleteTeam,
  };
};