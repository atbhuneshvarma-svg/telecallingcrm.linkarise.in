// Add to your existing types in ./core/types.ts
export interface Team {
  teammid: number;
  teamname: string;
  teamcode?: string;
  teamleadername?: string;
  teamleaderemail?: string;
  membercount?: number;
  // Add other team properties as needed
}

export interface BulkAllocationPayload {
  campaignId: number;
  campaignName: string;
  teamIds: number[];
  teamNames: string[];
}