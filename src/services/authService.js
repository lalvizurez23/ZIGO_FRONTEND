import api from './api'

export const authService = {
  // Login
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials)
    return response.data
  },

  // Register
  register: async (userData) => {
    const response = await api.post('/auth/register', userData)
    return response.data
  },

  // Logout
  logout: async () => {
    const response = await api.post('/auth/logout')
    return response.data
  },

  // Logout all devices
  logoutAll: async () => {
    const response = await api.post('/auth/logout-all')
    return response.data
  },

  // Get current user profile
  getProfile: async () => {
    const response = await api.get('/auth/profile')
    return response.data
  },

  // Refresh token (if needed)
  refreshToken: async () => {
    const response = await api.post('/auth/refresh')
    return response.data
  }
}
