/**
 * Cliente Axios para comunicación con el backend The Center.
 * Backend: http://localhost:5000
 */
import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
})

export default api
