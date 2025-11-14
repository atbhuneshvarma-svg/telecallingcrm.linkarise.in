// src/app/modules/apps/manage/teams/core/_requests.ts
import axios from "axios";
import {
  Team,
  TeamsResponse,
  CreateTeamRequest,
  UpdateTeamRequest,
} from "./_models";

const API_URL =
  import.meta.env.VITE_APP_THEME_API_URL ||
  "https://financecrm.linkarise.in/api";

export const teamRequests = {
  /**
   * ✅ Get all teams with pagination and search
   */
  getTeams: async (
    page: number = 1,
    limit: number = 10,
    search: string = ""
  ): Promise<TeamsResponse> => {
    const response = await axios.post<TeamsResponse>(`${API_URL}/teamlist`, {
      page,
      limit,
      search,
    });
    console.log("Teams API Response:", response.data);
    return response.data;
  },

  /**
   * ✅ Create a new team
   */
  createTeam: async (
    teamData: CreateTeamRequest
  ): Promise<{ result: boolean; message: string }> => {
    const response = await axios.post<{ result: boolean; message: string }>(
      `${API_URL}/teams`,
      teamData
    );
    console.log("Create Team Response:", response.data);
    return response.data;
  },

  /**
   * ✅ Update a team
   */
  updateTeam: async (
    teamId: number,
    teamData: UpdateTeamRequest
  ): Promise<{ result: boolean; message: string }> => {
    const response = await axios.put<{ result: boolean; message: string }>(
      `${API_URL}/teams/${teamId}`,
      teamData
    );
    console.log("Update Team Response:", response.data);
    return response.data;
  },

  /**
   * ✅ Delete a team
   */
  deleteTeam: async (
    teamId: number
  ): Promise<{ result: boolean; message: string }> => {
    const response = await axios.delete<{ result: boolean; message: string }>(
      `${API_URL}/teams/${teamId}?tmid=${teamId}`
    );
    console.log("Delete Team Response:", response.data);
    return response.data;
  },

  /**
   * ✅ Get team by ID
   */
  getTeamById: async (teamId: number): Promise<Team> => {
    const response = await axios.get<{ result: boolean; data: Team }>(
      `${API_URL}/teams/${teamId}`
    );
    console.log("Get Team By ID Response:", response.data);
    return response.data.data;
  },

  /**
   * ✅ Get all users for team lead selection
   */
  getTeamLeads: async (): Promise<any[]> => {
    try {
      const response = await axios.post<{ result: boolean; data: any[] }>(
        `${API_URL}/userslist`,
        {} // Send empty body or remove this parameter if not needed
      );
      console.log("Team Leads API Response:", response.data);

      // Filter team leaders on frontend
      const teamLeads = response.data.data.filter(
        (user) => user.userrole === "teamleader" && user.userstatus === "Active"
      );

      return teamLeads;
    } catch (error) {
      console.error("Error fetching team leads:", error);
      // Return mock data if API fails
      return [
        {
          usermid: 79,
          username: "vishal",
          useremail: "vishal@gmail.com",
          userstatus: "Active",
          designation: "Team Leader",
          userrole: "teamleader",
        },
      ];
    }
  },
};
