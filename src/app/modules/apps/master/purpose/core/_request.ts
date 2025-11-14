import axios from "axios";

const API_URL = import.meta.env.VITE_APP_THEME_API_URL;

// Endpoints
const GET_PURPOSE_URL = `${API_URL}/purpose`;
const ADD_PURPOSE_URL = `${API_URL}/purposeadd`;
const PURPOSE_URL = `${API_URL}/purpose`; // for update/delete

export interface Purpose {
  id: number;
  name: string;
}

// ✅ Helper: handle both `status` and `result`
const isSuccessResponse = (data: any): boolean => {
  return data?.status === "success" || data?.result === true;
};

// ✅ Get all purposes
export const getPurposes = async (): Promise<Purpose[]> => {
  const response = await axios.post(GET_PURPOSE_URL);

  if (!isSuccessResponse(response.data)) {
    throw new Error("Failed to fetch purposes");
  }

  const items = response.data.data || [];
  return items.map((item: any) => ({
    id: item.purposemid,
    name: item.purposename,
  }));
};

// ✅ Add purpose
export const addPurpose = async (name: string): Promise<Purpose> => {
  const response = await axios.post(
    `${ADD_PURPOSE_URL}?purposename=${encodeURIComponent(name)}`
  );

  if (!isSuccessResponse(response.data)) {
    throw new Error("Failed to add purpose");
  }

  const item = response.data.data;
  return {
    id: item.purposemid,
    name: item.purposename,
  };
};

// ✅ Update purpose
export const updatePurpose = async (
  id: number,
  name: string
): Promise<Purpose> => {
  const response = await axios.put(`${PURPOSE_URL}/${id}`, {
    purposename: name,
  });

  if (!isSuccessResponse(response.data)) {
    throw new Error("Failed to update purpose");
  }

  const item = response.data.data;
  return {
    id: item.purposemid,
    name: item.purposename,
  };
};

// ✅ Delete purpose
export const deletePurpose = async (id: number): Promise<void> => {
  const response = await axios.delete(`${PURPOSE_URL}/${id}`);

  if (!isSuccessResponse(response.data)) {
    throw new Error("Failed to delete purpose");
  }
};

// ✅ purposeApi object (refactored for consistency)
export const purposeApi = {
  async getAllPurposes(): Promise<Purpose[]> {
    const response = await axios.post(GET_PURPOSE_URL);

    if (!isSuccessResponse(response.data)) {
      throw new Error("API returned failure");
    }

    const items = response.data.data || [];
    return items.map((item: any) => ({
      id: item.purposemid,
      name: item.purposename,
    }));
  },

  async createPurpose(purpose: Omit<Purpose, "id">): Promise<Purpose> {
    const response = await axios.post(
      `${ADD_PURPOSE_URL}?purposename=${encodeURIComponent(purpose.name)}`
    );

    if (!isSuccessResponse(response.data)) {
      throw new Error("API returned failure");
    }

    const item = response.data.data;
    return {
      id: item.purposemid,
      name: item.purposename,
    };
  },

  async updatePurpose(
    id: number,
    purpose: Omit<Purpose, "id">
  ): Promise<Purpose> {
    const response = await axios.put(`${PURPOSE_URL}/${id}`, {
      purposename: purpose.name,
    });

    if (!isSuccessResponse(response.data)) {
      throw new Error("API returned failure");
    }

    const item = response.data.data;
    return {
      id: item.purposemid,
      name: item.purposename,
    };
  },

  async deletePurpose(id: number): Promise<void> {
    const response = await axios.delete(`${PURPOSE_URL}/${id}`);

    if (!isSuccessResponse(response.data)) {
      throw new Error("API returned failure");
    }
  },
  // Add this method to your purposeApi object
  async getPurposesPaginated(
    page: number = 1,
    perPage: number = 10
  ): Promise<any> {
    const response = await axios.post(
      `${GET_PURPOSE_URL}?page=${page}&per_page=${perPage}`
    );

    if (!isSuccessResponse(response.data)) {
      throw new Error("Failed to fetch purposes");
    }

    const items = response.data.data || [];
    return {
      data: items.map((item: any) => ({
        id: item.purposemid,
        name: item.purposename,
      })),
      current_page: response.data.current_page,
      per_page: response.data.per_page,
      total_records: response.data.total_records,
      total_pages: response.data.total_pages,
    };
  },
};

// ✅ Common error handler
export const handleApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return (
      error.response?.data?.message || error.message || "API request failed"
    );
  }
  return error instanceof Error ? error.message : "Unknown error occurred";
};
