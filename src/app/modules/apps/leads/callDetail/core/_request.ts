import axios from 'axios'
import { CallDetail } from './_models'

const API_URL = import.meta.env.VITE_APP_THEME_API_URL
const CALL_DETAILS_URL = `${API_URL}/calldetails`

export const callDetailsApi = {
  // ✅ Server-side pagination using POST
  getPaginated: async (page: number = 1, perPage: number = 10, search: string = '') => {
    const response = await axios.post(CALL_DETAILS_URL, {
      page,
      per_page: perPage,
      search,
    })
    return response.data
  },
}
