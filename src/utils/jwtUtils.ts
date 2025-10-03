import { jwtDecode } from 'jwt-decode'

interface DecodedToken {
  sub: string
  email: string
  iat: number
  exp: number
}

interface UserInfo {
  id: string
  email: string
}

/**
 * Decodifica un token JWT y extrae la información básica
 * @param token - Token JWT
 * @returns Información básica del token
 */
export const decodeToken = (token: string): UserInfo => {
  try {
    if (!token) {
      throw new Error('Token no proporcionado')
    }

    const decoded = jwtDecode<DecodedToken>(token)

    // Extraer información básica del token
    // NOTA: El backend solo incluye sub (userId), email e iat en el JWT
    // Los demás datos del usuario vienen en el body de la respuesta del login
    return {
      id: decoded.sub, // userId del backend
      email: decoded.email
    }
  } catch (error) {
    console.error('Error decodificando token:', error)
    throw new Error('Token inválido')
  }
}
