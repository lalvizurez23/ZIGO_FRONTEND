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
  idUsuario: number
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
  idCarritoItem: number
  idCarrito: number
  idProducto: number
  cantidad: number
  fechaAgregado: string
  producto?: {
    idProducto: number
    nombre: string
    descripcion: string
    precio: number
    stock: number
    imagenUrl?: string
    estaActivo: boolean
  }
}

export interface Cart {
  idCarrito: number
  idUsuario: number
  estaActivo: boolean
  fechaCreacion: string
  fechaActualizacion: string
  items: CartItem[]
  total?: number
}

// Tipos para Pedidos
export interface OrderDetail {
  idDetallePedido: number
  idPedido: number
  idProducto: number
  cantidad: number
  precioUnitario: number
  subtotal: number
  producto: {
    idProducto: number
    nombre: string
    descripcion: string
    precio: number
    imagenUrl?: string
  }
}

export interface Order {
  idPedido: number
  idUsuario: number
  numeroPedido: string
  total: number
  estado: string
  metodoPago?: string
  direccionEnvio?: string
  notas?: string
  fechaPedido: string
  detalles: OrderDetail[]
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
