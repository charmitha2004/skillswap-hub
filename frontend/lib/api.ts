import axios from 'axios'

const getBaseURL = () => {
  if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL

  if (typeof window !== 'undefined') {
    return `${window.location.protocol}//${window.location.hostname}:5001/api`
  }

  return 'http://localhost:5001/api'
}

const api = axios.create({
  baseURL: getBaseURL(),
  timeout: 10000,
})

api.interceptors.request.use((config) => {
  if (typeof window === 'undefined') return config

  const token = localStorage.getItem('skillswap_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

// User API
export const userApi = {
  getAll: () => api.get('/users'),
  getById: (userId: number) => api.get(`/users/${userId}`),
  update: (userId: number, data: { name?: string; department?: string; teachSkills?: string[]; learnSkills?: string[] }) => api.put(`/users/${userId}`, data),
  search: (params: { q?: string; department?: string }) => api.get('/users', { params }),
}

export const profileApi = {
  me: () => api.get('/profile/me'),
  updateMe: (data: { teachSkills: string[]; learnSkills: string[] }) => api.put('/profile/me', data),
}

// Request API
export const requestApi = {
  getAll: () => api.get('/requests'),
  send: (data: { receiverId?: number; skill: string; title: string; description?: string }) => api.post('/requests', data),
  update: (requestId: number, status: 'accepted' | 'declined') => api.patch(`/requests/${requestId}`, { status }),
}

// Match API
export const matchApi = {
  getAll: () => api.get('/matches'),
  getSummary: () => api.get('/matches/summary'),
}

export default api
