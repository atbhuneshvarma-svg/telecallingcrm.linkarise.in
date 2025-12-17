import axios from 'axios'

const API_URL = import.meta.env.VITE_APP_THEME_API_URL;

export const leadService = {
  async getStageWiseLeads(page: number = 1) {
    const response = await axios.post(`${API_URL}/lead/stagewise`, {
      page,
    })
    return response.data.data
  }
}