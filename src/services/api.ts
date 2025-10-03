import axios from 'axios'

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
          // Token expirado o inválido - solo rechazar la promesa
          // La redirección se maneja en el componente ProtectedRoute
        }
        return Promise.reject(error)
      }
)

export default api
