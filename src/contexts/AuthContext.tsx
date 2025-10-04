import React, { createContext, useContext, useEffect, ReactNode } from 'react'
import { useAppSelector } from '../store/hooks'
import { setAuthToken } from '../services/api'
import { useLogin, useRegister, useLogout, useUpdateToken } from '../hooks/useAuth'
import { LoginCredentials, RegisterData, User } from '../types'

interface AuthContextType {
  user: User | null
  accessToken: string | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
  login: (credentials: LoginCredentials) => Promise<any>
  register: (userData: RegisterData) => Promise<any>
  logout: () => Promise<void>
  logoutAll: () => Promise<void>
  updateAuthToken: (newToken: string) => void
}

interface AuthProviderProps {
  children: ReactNode
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { user, accessToken, isAuthenticated, loading, error } = useAppSelector((state) => state.auth)

  // Hooks de TanStack Query
  const loginMutation = useLogin()
  const registerMutation = useRegister()
  const logoutMutation = useLogout()
  const updateAuthToken = useUpdateToken()

  // Sincronizar token con el interceptor de Axios
  useEffect(() => {
    if (accessToken) {
      setAuthToken(accessToken)
    } else {
      setAuthToken(null)
    }
  }, [accessToken])

  // No verificamos localStorage para usuario
  // Toda la información del usuario viene del token JWT decodificado
  // Esto es más seguro ya que no exponemos datos sensibles en localStorage

  const login = async (credentials: LoginCredentials): Promise<any> => {
    try {
      const result = await loginMutation.mutateAsync(credentials)
      return result
    } catch (error) {
      throw error
    }
  }

  const register = async (userData: RegisterData): Promise<any> => {
    try {
      const result = await registerMutation.mutateAsync(userData)
      return result
    } catch (error) {
      throw error
    }
  }

  const logout = async (): Promise<void> => {
    try {
      await logoutMutation.mutateAsync()
    } catch (error) {
      console.error('Error during logout:', error)
    }
  }

  const logoutAll = async (): Promise<void> => {
    try {
      await logoutMutation.mutateAsync()
    } catch (error) {
      console.error('Error during logout all:', error)
    }
  }

  const value: AuthContextType = {
    user,
    accessToken,
    isAuthenticated,
    loading: loading || loginMutation.isPending || registerMutation.isPending || logoutMutation.isPending,
    error: error || loginMutation.error?.message || registerMutation.error?.message || logoutMutation.error?.message || null,
    login,
    register,
    logout,
    logoutAll,
    updateAuthToken
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
