import React, { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import LoadingSpinner from './LoadingSpinner'
import api from '../services/api'

const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, loading, accessToken } = useAuth()
  const [isVerifying, setIsVerifying] = useState(true)
  const [shouldRedirect, setShouldRedirect] = useState(false)

  useEffect(() => {
    // Si ya está autenticado, no necesitamos verificar
    if (isAuthenticated) {
      setIsVerifying(false)
      return
    }

    // Si no hay token, redirigir inmediatamente
    if (!accessToken) {
      setShouldRedirect(true)
      setIsVerifying(false)
      return
    }

    // Si hay token pero no está autenticado, verificar con el backend
    const verifyToken = async () => {
      try {
        // Usar una petición simple para verificar el token
        // Intentar obtener productos (ruta que requiere autenticación)
        const response = await api.get('/productos?page=1&limit=1')

        if (response.status === 200) {
          // Token válido - no redirigir
          setShouldRedirect(false)
        } else {
          // Otro error - redirigir al login por seguridad
          setShouldRedirect(true)
        }
      } catch (error: any) {
        // Si es 401, el token es inválido
        if (error.response?.status === 401) {
          setShouldRedirect(true)
        } else {
          // Otro error - redirigir al login por seguridad
          setShouldRedirect(true)
        }
      } finally {
        setIsVerifying(false)
      }
    }

    verifyToken()
  }, [isAuthenticated, accessToken])

  if (loading || isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner message="Verificando autenticación..." size="lg" />
      </div>
    )
  }

  // Solo redirigir al login si el backend confirmó que el token es inválido
  if (shouldRedirect) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}

export default ProtectedRoute
