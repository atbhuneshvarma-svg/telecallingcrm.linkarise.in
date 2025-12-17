import { useState, useEffect, useCallback, useMemo } from 'react';
import { Lead, PaginationInfo } from '../core/_models';
import { leadApi } from '../core/_request';

interface UseLeadsProps {
  initialPage?: number;
  initialPerPage?: number;
  serverSideFiltering?: boolean;
}

interface UseLeadsReturn {
  leads: Lead[];
  filteredLeads: Lead[];
  loading: boolean;
  pagination: PaginationInfo;
  filters: { user: string; campaign: string; status: string; team: string };
  entriesPerPage: number;
  currentPage: number;
  setFilters: React.Dispatch<
    React.SetStateAction<{
      user: string;
      campaign: string;
      status: string;
      team: string;
    }>
  >;
  setEntriesPerPage: (perPage: number) => void;
  setCurrentPage: (page: number) => void;
  fetchLeads: () => Promise<void>;
  handleFilterChange: (
    filterType: 'user' | 'campaign' | 'status' | 'team',
    value: string
  ) => void;
  handlePageChange: (page: number) => void;
  handleEntriesPerPageChange: (perPage: number) => void;
  refreshLeads: () => Promise<void>;
  deleteLead: (leadId: number) => Promise<{ success: boolean; message: string }>;
  deleteMultipleLeads: (leadIds: number[]) => Promise<{ success: boolean; message: string }>;
  uniqueUsers: Array<{ id: number; name: string }>;
  uniqueCampaigns: Array<{ id: number; name: string }>;
  uniqueStatuses: Array<{ id: number; name: string; color: string }>;
  uniqueTeams: Array<{ id: number; name: string }>;
  filterOptions: {
    users: Array<{ id: number; name: string }>;
    teams: Array<{ id: number; name: string }>;
    campaigns: Array<{ id: number; name: string }>;
    statuses: Array<{ id: number; name: string; color: string }>;
  };
  filterOptionsLoading: boolean;
}

export const useLeads = ({
  initialPage = 1,
  initialPerPage = 10,
  serverSideFiltering = false,
}: UseLeadsProps = {}): UseLeadsReturn => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filterOptionsLoading, setFilterOptionsLoading] = useState<boolean>(true);
  const [pagination, setPagination] = useState<PaginationInfo>({
    current_page: initialPage,
    per_page: initialPerPage,
    total_records: 0,
    total_pages: 1,
  });

  const [filterOptions, setFilterOptions] = useState<{
    users: Array<{ id: number; name: string }>;
    teams: Array<{ id: number; name: string }>;
    campaigns: Array<{ id: number; name: string }>;
    statuses: Array<{ id: number; name: string; color: string }>;
  }>({
    users: [],
    teams: [],
    campaigns: [],
    statuses: [],
  });

  const [filters, setFilters] = useState({
    user: 'All Users',
    campaign: 'All Campaigns',
    status: 'All Statuses',
    team: 'All Teams',
  });

  const [entriesPerPage, setEntriesPerPageState] = useState<number>(initialPerPage);
  const [currentPage, setCurrentPageState] = useState<number>(initialPage);

  // Fetch filter options
  const fetchFilterOptions = useCallback(async () => {
    setFilterOptionsLoading(true);
    try {
      const options = await leadApi.getFilterOptions();
      setFilterOptions(options);
    } catch (error) {
      console.error('❌ Error fetching filter options:', error);
    } finally {
      setFilterOptionsLoading(false);
    }
  }, []);

  // Fetch leads with pagination and filtering
  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = {
        page: currentPage,
        per_page: entriesPerPage,
      };

      if (serverSideFiltering) {
        // Use correct API parameter names with actual IDs from the API response
        if (filters.user !== 'All Users') {
          const user = filterOptions.users.find((u) => u.name === filters.user);
          if (user) params.user_filter = user.id;
        }
        if (filters.campaign !== 'All Campaigns') {
          const campaign = filterOptions.campaigns.find((c) => c.name === filters.campaign);
          if (campaign) params.campaign_filter = campaign.id;
        }
        if (filters.status !== 'All Statuses') {
          const status = filterOptions.statuses.find((s) => s.name === filters.status);
          if (status) params.status_filter = status.name;
        }
        if (filters.team !== 'All Teams') {
          const team = filterOptions.teams.find((t) => t.name === filters.team);
          if (team) params.team_filter = team.id;
        }

        console.log('🌐 Fetching leads with server-side params:', params);
      }

      const response = await leadApi.getLeadsPaginated(params);

      if (response.result) {
        setLeads(response.data || []);
        setPagination({
          current_page: response.current_page || 1,
          per_page: response.per_page || entriesPerPage,
          total_records: response.total_records || 0,
          total_pages: response.total_pages || 1,
        });
      } else {
        console.error('❌ API returned error:', response.message);
        setLeads([]);
      }
    } catch (error) {
      console.error('❌ Error fetching leads:', error);
      setLeads([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, entriesPerPage, filters, serverSideFiltering, filterOptions]);

  // Delete single lead
  const deleteLead = useCallback(
    async (leadId: number): Promise<{ success: boolean; message: string }> => {
      try {
        const response = await leadApi.deleteLead(leadId);
        if (response.result) {
          await fetchLeads();
          return { success: true, message: response.message || 'Lead deleted successfully' };
        } else {
          return { success: false, message: response.message || 'Failed to delete lead' };
        }
      } catch (error: any) {
        console.error('❌ Error deleting lead:', error);
        return {
          success: false,
          message: error.response?.data?.message || 'Failed to delete lead',
        };
      }
    },
    [fetchLeads]
  );

  // Delete multiple leads
  const deleteMultipleLeads = useCallback(
    async (leadIds: number[]): Promise<{ success: boolean; message: string }> => {
      try {
        const response = await leadApi.deleteLeads(leadIds);
        if (response.result) {
          await fetchLeads();
          return { success: true, message: response.message || 'Leads deleted successfully' };
        } else {
          return { success: false, message: response.message || 'Failed to delete leads' };
        }
      } catch (error: any) {
        console.error('❌ Error deleting leads:', error);
        return {
          success: false,
          message: error.response?.data?.message || 'Failed to delete leads',
        };
      }
    },
    [fetchLeads]
  );

  // Initial data fetch
  useEffect(() => {
    const initializeData = async () => {
      await Promise.all([fetchFilterOptions(), fetchLeads()]);
    };
    initializeData();
  }, []);

  // Fetch leads when dependencies change
  useEffect(() => {
    if (!filterOptionsLoading) {
      fetchLeads();
    }
  }, [currentPage, entriesPerPage, serverSideFiltering ? filters : undefined, filterOptionsLoading]);

  // Client-side filtering
  const filteredLeads = useMemo(() => {
    if (serverSideFiltering) return leads;

    return leads.filter((lead) => {
      const matchesUser =
        filters.user === 'All Users' ||
        (lead.username && lead.username.toLowerCase() === filters.user.toLowerCase());

      const matchesCampaign =
        filters.campaign === 'All Campaigns' ||
        (lead.campaignname && lead.campaignname.toLowerCase() === filters.campaign.toLowerCase());

      const matchesStatus =
        filters.status === 'All Statuses' ||
        (lead.statusname && lead.statusname.toLowerCase() === filters.status.toLowerCase());

      const matchesTeam =
        filters.team === 'All Teams' ||
        (lead.teamname && lead.teamname.toLowerCase() === filters.team.toLowerCase());

      return matchesUser && matchesCampaign && matchesStatus && matchesTeam;
    });
  }, [leads, filters, serverSideFiltering]);

  // Derived unique values for filters (client-side only)
  const uniqueUsers = useMemo(() => {
    if (serverSideFiltering) return filterOptions.users;
    return [
      { id: 0, name: 'All Users' },
      ...Array.from(new Set(leads.map((l) => l.username).filter(Boolean))).map(
        (username, index) => ({
          id: index + 1,
          name: username as string,
        })
      ),
    ];
  }, [leads, serverSideFiltering, filterOptions.users]);

  const uniqueCampaigns = useMemo(() => {
    if (serverSideFiltering) return filterOptions.campaigns;
    return [
      { id: 0, name: 'All Campaigns' },
      ...Array.from(new Set(leads.map((l) => l.campaignname).filter(Boolean))).map(
        (campaign, index) => ({
          id: index + 1,
          name: campaign as string,
        })
      ),
    ];
  }, [leads, serverSideFiltering, filterOptions.campaigns]);

  const uniqueStatuses = useMemo(() => {
    if (serverSideFiltering) return filterOptions.statuses;
    return [
      { id: 0, name: 'All Statuses', color: '#000000' },
      ...Array.from(new Set(leads.map((l) => l.statusname).filter(Boolean))).map(
        (status, index) => ({
          id: index + 1,
          name: status as string,
          color: leads.find((l) => l.statusname === status)?.statuscolor || '#000000',
        })
      ),
    ];
  }, [leads, serverSideFiltering, filterOptions.statuses]);

  const uniqueTeams = useMemo(() => {
    if (serverSideFiltering) return filterOptions.teams;
    return [
      { id: 0, name: 'All Teams' },
      ...Array.from(new Set(leads.map((l) => l.teamname).filter(Boolean))).map((team, index) => ({
        id: index + 1,
        name: team as string,
      })),
    ];
  }, [leads, serverSideFiltering, filterOptions.teams]);

  // Filter handlers
  const handleFilterChange = useCallback(
    (filterType: 'user' | 'campaign' | 'status' | 'team', value: string) => {
      setFilters((prev) => ({ ...prev, [filterType]: value }));
      setCurrentPageState(1);
    },
    []
  );

  const handlePageChange = useCallback((page: number) => setCurrentPageState(page), []);

  const handleEntriesPerPageChange = useCallback((perPage: number) => {
    setEntriesPerPageState(perPage);
    setCurrentPageState(1);
  }, []);

  const refreshLeads = useCallback(async () => {
    await Promise.all([fetchFilterOptions(), fetchLeads()]);
  }, [fetchFilterOptions, fetchLeads]);

  return {
    leads,
    filteredLeads,
    loading,
    pagination,
    filters,
    entriesPerPage,
    currentPage,
    setFilters,
    setEntriesPerPage: handleEntriesPerPageChange,
    setCurrentPage: handlePageChange,
    fetchLeads,
    handleFilterChange,
    handlePageChange,
    handleEntriesPerPageChange,
    refreshLeads,
    deleteLead,
    deleteMultipleLeads,
    uniqueUsers,
    uniqueCampaigns,
    uniqueStatuses,
    uniqueTeams,
    filterOptions,
    filterOptionsLoading,
  };
};