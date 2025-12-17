import axios from 'axios';
import { LeadApiResponse, Lead, CreateLeadRequest } from './_models';

const API_URL = import.meta.env.VITE_APP_THEME_API_URL;

export const leadApi = {
  /**
   * ✅ Get paginated leads (supports server-side filtering)
   */
  // In your leadApi file - FIXED VERSION FOR POST
  getLeadsPaginated: async (params: {
    page?: number;
    per_page?: number;
    user_filter?: string;
    campaign_filter?: string;
    status_filter?: string;
    team_filter?: string;
    search?: string;
  }) => {
    try {
      const requestBody: any = {};

      // Pagination
      if (params.page) requestBody.page = params.page;
      if (params.per_page) requestBody.per_page = params.per_page;

      // Filters
      if (params.user_filter) requestBody.user_filter = params.user_filter;
      if (params.campaign_filter) requestBody.campaign_filter = params.campaign_filter;
      if (params.status_filter) requestBody.status_filter = params.status_filter;
      if (params.team_filter) requestBody.team_filter = params.team_filter;
      if (params.search) requestBody.search = params.search;

      const url = `${API_URL}/leads`;
      console.log('🌐 Fetching leads via POST with body:', requestBody);

      const res = await axios.post(url, requestBody, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });

      return res.data;
    } catch (err: any) {
      console.error('❌ getLeadsPaginated API Error:', err.response?.data || err.message);
      return {
        result: false,
        message: 'Failed to fetch leads',
        data: [],
        current_page: params.page || 1,
        per_page: params.per_page || 10,
        total_records: 0,
        total_pages: 1,
        users: [],
        teams: [],
        campaigns: [],
        status: [],
      };
    }
  },

  /**
   * ✅ Get dropdown filter options (users, campaigns, statuses, teams)
   */
  getFilterOptions: async (): Promise<{
    users: Array<{ id: number; name: string }>;
    teams: Array<{ id: number; name: string }>;
    campaigns: Array<{ id: number; name: string }>;
    statuses: Array<{ id: number; name: string; color: string }>;
  }> => {
    try {
      const response = await axios.post(
        `${API_URL}/leads`,
        {
          page: 1,
          per_page: 1,
        },
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        }
      );

      const result = response.data as {
        users?: Array<{ usermid: number; username: string }>;
        teams?: Array<{ tmid: number; teamname: string }>;
        campaigns?: Array<{ campaignmid: number; campaignname: string }>;
        status?: Array<{ statusmid: number; statusname: string; statuscolor: string }>;
      };

      const users =
        result?.users?.map((u) => ({
          id: u.usermid,
          name: u.username,
        })) ?? [];

      const teams =
        result?.teams?.map((t) => ({
          id: t.tmid,
          name: t.teamname,
        })) ?? [];

      const campaigns =
        result?.campaigns?.map((c) => ({
          id: c.campaignmid,
          name: c.campaignname,
        })) ?? [];

      const statuses =
        result?.status?.map((s) => ({
          id: s.statusmid,
          name: s.statusname,
          color: s.statuscolor,
        })) ?? [];

      return { users, teams, campaigns, statuses };
    } catch (error: any) {
      console.error('❌ Error fetching filter options:', error.response?.data || error.message);
      return {
        users: [],
        teams: [],
        campaigns: [],
        statuses: [],
      };
    }
  },

  /**
   * ✅ Get all leads (for allocation, not paginated)
   */
  getLeadsForAllocation: async (): Promise<Lead[]> => {
    try {
      const response = await axios.post<LeadApiResponse>(`${API_URL}/leads`, {
        per_page: 1000, // Large number to get all leads
      });

      if (response.data.result) {
        return response.data.data.map((lead) => ({ ...lead, isSelected: false }));
      }
      return [];
    } catch (error: any) {
      console.error(
        '❌ Error fetching leads for allocation:',
        error.response?.data || error.message
      );
      return [];
    }
  },

  /**
   * ✅ Get single lead by ID
   */
  getLead: async (leadId: number): Promise<Lead | null> => {
    try {
      const response = await axios.get<{ result: boolean; message: string; data: Lead }>(
        `${API_URL}/leads/${leadId}`
      );

      if (response.data.result) {
        return response.data.data;
      }
      return null;
    } catch (error: any) {
      console.error('❌ Error fetching lead:', error.response?.data || error.message);
      return null;
    }
  },

  /**
   * ✅ Create new lead
   */
  createLead: async (
    leadData: CreateLeadRequest
  ): Promise<{ result: boolean; message: string }> => {
    try {
      const response = await axios.post(`${API_URL}/lead`, leadData);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error creating lead:', error.response?.data || error.message);
      return {
        result: false,
        message: error.response?.data?.message || 'Failed to create lead',
      };
    }
  },

  /**
   * ✅ Update existing lead
   */
  updateLead: async (
    leadId: number,
    leadData: Partial<Lead>
  ): Promise<{ result: boolean; message: string }> => {
    try {
      const response = await axios.put(`${API_URL}/lead/${leadId}`, leadData);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error updating lead:', error.response?.data || error.message);
      return {
        result: false,
        message: error.response?.data?.message || 'Failed to update lead',
      };
    }
  },

  /**
   * ✅ Delete a single lead
   */
  deleteLead: async (leadId: number): Promise<{ result: boolean; message: string }> => {
    try {
      const response = await axios.delete(`${API_URL}/lead/${leadId}`);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error deleting lead:', error.response?.data || error.message);
      return {
        result: false,
        message: error.response?.data?.message || 'Failed to delete lead',
      };
    }
  },

  /**
   * ✅ Delete multiple leads at once
   */
  deleteLeads: async (leadIds: number[]): Promise<{ result: boolean; message: string }> => {
    try {
      const response = await axios.post(`${API_URL}/leads/delete-bulk`, { leadIds });
      return response.data;
    } catch (error: any) {
      console.error('❌ Error deleting leads:', error.response?.data || error.message);
      return {
        result: false,
        message: error.response?.data?.message || 'Failed to delete leads',
      };
    }
  },

  /**
   * ✅ Update lead status
   */
  updateLeadStatus: async (payload: {
    leadmid: number;
    followup: number;
    followupremark: string;
    followupdate: string;
    statusname: string;
    activityname: string;
    starttime: string;
    endtime: string;
    mobileno: string;
    isclient: number;
  }): Promise<{ result: boolean; message: string; errors?: Record<string, string[]> }> => {
    try {
      const response = await axios.post(`${API_URL}/leadstatusupdate`, payload);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error updating lead status:', error.response?.data || error.message);
      return {
        result: false,
        message: error.response?.data?.message || 'Failed to update lead status',
        errors: error.response?.data?.errors,
      };
    }
  },

  /**
   * ✅ Get team members for a specific team
   */
  getTeamMembers: async (teamId: number): Promise<Array<{ id: number; name: string }>> => {
    try {
      const response = await axios.post(`${API_URL}/leads`, {
        page: 1,
        per_page: 1,
      });

      const teams = response.data.teams as Array<{
        tmid: number;
        teamname: string;
        members: Array<{
          user: {
            usermid: number;
            username: string;
          };
        }>;
      }>;

      const team = teams.find((t) => t.tmid === teamId);

      if (team && team.members) {
        return team.members.map((member) => ({
          id: member.user.usermid,
          name: member.user.username,
        }));
      }

      return [];
    } catch (error: any) {
      console.error('❌ Error fetching team members:', error.response?.data || error.message);
      return [];
    }
  },
};
