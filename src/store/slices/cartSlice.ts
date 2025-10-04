import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { cartService } from '../../services/cartService'

// Tipos para el carrito
interface CartItem {
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

interface Cart {
  idCarrito: number
  idUsuario: number
  estaActivo: boolean
  fechaCreacion: string
  fechaActualizacion: string
  items: CartItem[]
  total?: number
}

interface CartState {
  cart: Cart | null
  cartId: number | null
  loading: boolean
  error: string | null
}

// Estado inicial
const initialState: CartState = {
  cart: null,
  cartId: null,
  loading: false,
  error: null,
}

// Async thunks
export const getCart = createAsyncThunk<Cart, void, { rejectValue: string }>(
  'cart/getCart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await cartService.getCart()
      return response
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al obtener carrito')
    }
  }
)

export const createCart = createAsyncThunk<Cart, void, { rejectValue: string }>(
  'cart/createCart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await cartService.createCart()
      return response
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al crear carrito')
    }
  }
)

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearCart: (state) => {
      state.cart = null
      state.cartId = null
      state.loading = false
      state.error = null
    },
    setCartId: (state, action: PayloadAction<number>) => {
      state.cartId = action.payload
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Cart
      .addCase(getCart.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getCart.fulfilled, (state, action) => {
        state.loading = false
        state.cart = action.payload
        state.cartId = action.payload.idCarrito
        state.error = null
      })
      .addCase(getCart.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Error al obtener carrito'
        // Si no hay carrito, no es un error crítico
        if (action.payload?.includes('no encontrado')) {
          state.cart = null
          state.cartId = null
        }
      })
      
      // Create Cart
      .addCase(createCart.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createCart.fulfilled, (state, action) => {
        state.loading = false
        state.cart = action.payload
        state.cartId = action.payload.idCarrito
        state.error = null
      })
      .addCase(createCart.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Error al crear carrito'
      })
  },
})

export const { clearCart, setCartId, clearError } = cartSlice.actions
export default cartSlice.reducer
