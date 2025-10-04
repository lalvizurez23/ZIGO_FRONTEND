import api from './api'
import { LoginCredentials, RegisterData, AuthResponse } from '../types'

export const authService = {
  // Login
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', credentials)
    return response.data
  },

  // Register
  register: async (userData: RegisterData): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', userData)
    return response.data
  },

  // Logout
  logout: async (): Promise<void> => {
    const response = await api.post('/auth/logout')
    return response.data
  },
}
