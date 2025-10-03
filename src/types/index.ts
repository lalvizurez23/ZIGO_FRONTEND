// Tipos para Productos
export interface Product {
  id: number
  nombre: string
  descripcion: string
  precio: number
  stock: number
  imageUrl?: string
  idCategoria: number
  categoria?: {
    id: number
    nombre: string
  }
}

// Tipos para Usuario
export interface User {
  email: string
  nombre: string
  apellido: string
  telefono: string
  direccion: string
  estaActivo: boolean
  fechaCreacion: string
}

// Tipos para Carrito
export interface CartItem {
  id: number
  productId: number
  quantity: number
  precio: number
  producto?: {
    id: number
    nombre: string
    descripcion: string
    precio: number
    imageUrl?: string
  }
}

// Tipos para Pedidos
export interface Order {
  id: number
  fechaCreacion: string
  estado: string
  total: number
  direccionEnvio: string
  items: Array<{
    id: number
    cantidad: number
    precio: number
    producto: {
      id: number
      nombre: string
      descripcion: string
      imageUrl?: string
    }
  }>
}

// Tipos para Autenticación
export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  nombre: string
  apellido: string
  email: string
  password: string
  telefono: string
  direccion: string
}

export interface AuthResponse {
  accessToken: string
  user: User
}
