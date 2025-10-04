import { useMutation, useQueryClient } from '@tanstack/react-query'
import { authService } from '../services/authService'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { clearAuth, updateToken } from '../store/slices/authSlice'
import { LoginCredentials, RegisterData } from '../types'

// Hook para login
export const useLogin = () => {
  const dispatch = useAppDispatch()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const response = await authService.login(credentials)
      return response
    },
    onSuccess: (data) => {
      // Actualizar Redux con los datos del usuario y token
      dispatch({
        type: 'auth/login/fulfilled',
        payload: data
      })
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['user'] })
    },
    onError: (error) => {
      console.error('Login error:', error)
    }
  })
}

// Hook para registro
export const useRegister = () => {
  const dispatch = useAppDispatch()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (userData: RegisterData) => {
      const response = await authService.register(userData)
      return response
    },
    onSuccess: (data) => {
      // Actualizar Redux con los datos del usuario y token
      dispatch({
        type: 'auth/register/fulfilled',
        payload: data
      })
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['user'] })
    },
    onError: (error) => {
      console.error('Register error:', error)
    }
  })
}

// Hook para logout
export const useLogout = () => {
  const dispatch = useAppDispatch()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      await authService.logout()
    },
    onSuccess: () => {
      // Limpiar Redux
      dispatch(clearAuth())
      // Limpiar todas las queries
      queryClient.clear()
    },
    onError: (error) => {
      console.error('Logout error:', error)
      // Limpiar estado incluso si hay error
      dispatch(clearAuth())
      queryClient.clear()
    }
  })
}

// Hook para obtener perfil del usuario (desde Redux)
export const useUserProfile = () => {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth)

  return {
    data: user,
    isLoading: false,
    isError: !isAuthenticated,
    error: null
  }
}

// Hook para actualizar token automáticamente
export const useUpdateToken = () => {
  const dispatch = useAppDispatch()

  return (newToken: string) => {
    dispatch(updateToken(newToken))
  }
}
