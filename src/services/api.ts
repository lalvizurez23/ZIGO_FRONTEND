import axios from 'axios'
import { store } from '../store'
import { clearAuth } from '../store/slices/authSlice'
import showToast from '../utils/toast'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Variable global para el token (solo en memoria)
let authToken: string | null = null

// Función para establecer el token desde Redux
export const setAuthToken = (token: string | null): void => {
  authToken = token
}

// Interceptor para agregar token de autenticación
api.interceptors.request.use(
  (config) => {
    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptor para manejar respuestas y errores
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido - limpiar estado y redirigir
      authToken = null
      localStorage.removeItem('token')
      
      // Limpiar estado de Redux
      store.dispatch(clearAuth())
      
      // Mostrar notificación
      showToast.warning('Tu sesión ha expirado. Por favor, inicia sesión nuevamente')
      
      // Redirigir al login
      setTimeout(() => {
        window.location.href = '/login'
      }, 1000)
    }
    return Promise.reject(error)
  }
)

export default api
