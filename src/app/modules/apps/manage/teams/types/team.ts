// types/team.ts
export interface Team {
  id: number;
  teamName: string;
  leader: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TeamsResponse {
  teams: Team[];
  total: number;
  currentPage: number;
  totalPages: number;
}

export interface PaginationParams {
  page: number;
  limit: number;
  search: string;
}