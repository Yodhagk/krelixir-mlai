import axios from 'axios'
import toast from 'react-hot-toast'

const api = axios.create({
  baseURL: '/api',
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use(
  (config) => {
    const auth = JSON.parse(localStorage.getItem('krelixir-auth') || '{}')
    const token = auth?.state?.token
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('krelixir-auth')
      window.location.href = '/login'
    } else if (error.response?.status >= 500) {
      toast.error('Server error. Please try again.')
    }
    return Promise.reject(error)
  }
)

// Auth
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  me: () => api.get('/auth/me'),
}

// Dashboard
export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
  getActivity: () => api.get('/dashboard/activity'),
  getCostComparison: () => api.get('/dashboard/cost-comparison'),
}

// Inventory
export const inventoryAPI = {
  getAll: () => api.get('/inventory'),
  getServers: () => api.get('/inventory/servers'),
  getDatabases: () => api.get('/inventory/databases'),
  getApplications: () => api.get('/inventory/applications'),
  getNetwork: () => api.get('/inventory/network'),
  addItem: (data) => api.post('/inventory', data),
  updateItem: (id, data) => api.put(`/inventory/${id}`, data),
  deleteItem: (id) => api.delete(`/inventory/${id}`),
  uploadCSV: (file) => {
    const form = new FormData()
    form.append('file', file)
    return api.post('/inventory/upload', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
}

// Recommendations
export const recommendationsAPI = {
  getAll: () => api.get('/recommendations'),
  analyze: () => api.post('/recommendations/analyze'),
  getById: (id) => api.get(`/recommendations/${id}`),
}

// AI Chat
export const aiAPI = {
  sendMessage: (message, context) => api.post('/ai/chat', { message, context }),
  getHistory: () => api.get('/ai/history'),
  clearHistory: () => api.delete('/ai/history'),
}

export default api
