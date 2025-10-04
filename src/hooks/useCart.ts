import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { cartService } from '../services/cartService'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { updateToken } from '../store/slices/authSlice'
import { setCartId } from '../store/slices/cartSlice'

// Hook para obtener carrito
export const useCart = () => {
  const dispatch = useAppDispatch()
  const { isAuthenticated } = useAppSelector((state) => state.auth)

  return useQuery({
    queryKey: ['cart'],
    queryFn: async () => {
      const response = await cartService.getCart()
      
      // Actualizar Redux con el ID del carrito
      if (response?.idCarrito) {
        dispatch(setCartId(response.idCarrito))
      }
      
      // Si la respuesta contiene un nuevo token, actualizarlo en Redux
      if (response.accessToken) {
        dispatch(updateToken(response.accessToken))
      }
      
      return response
    },
    enabled: isAuthenticated, // Solo se ejecuta si hay usuario autenticado
    staleTime: 2 * 60 * 1000, // 2 minutos
    retry: 1,
    refetchOnWindowFocus: false,
  })
}

// Hook para agregar item al carrito
export const useAddToCart = () => {
  const queryClient = useQueryClient()
  const dispatch = useAppDispatch()

  return useMutation({
    mutationFn: async ({ productId, quantity }: { productId: number; quantity: number }) => {
      // Obtener el carrito del usuario (el backend extrae el userId del token)
      const cart = await cartService.getCart()
      
      if (!cart) {
        throw new Error('No se pudo obtener el carrito del usuario')
      }

      // Agregar item al carrito existente
      const response = await cartService.addItem(cart.idCarrito, productId, quantity)
      
      // Si la respuesta contiene un nuevo token, actualizarlo en Redux
      if (response.accessToken) {
        dispatch(updateToken(response.accessToken))
      }
      
      return response
    },
    onSuccess: () => {
      // Invalidar el carrito para refrescar
      queryClient.invalidateQueries({ queryKey: ['cart'] })
    },
  })
}

// Hook para actualizar cantidad de item
export const useUpdateCartItem = () => {
  const queryClient = useQueryClient()
  const dispatch = useAppDispatch()

  return useMutation({
    mutationFn: async ({ itemId, quantity }: { itemId: number; quantity: number }) => {
      const response = await cartService.updateItem(itemId, quantity)
      
      // Si la respuesta contiene un nuevo token, actualizarlo en Redux
      if (response.accessToken) {
        dispatch(updateToken(response.accessToken))
      }
      
      return response
    },
    onSuccess: () => {
      // Invalidar el carrito para refrescar
      queryClient.invalidateQueries({ queryKey: ['cart'] })
    },
  })
}

// Hook para eliminar item del carrito
export const useRemoveFromCart = () => {
  const queryClient = useQueryClient()
  const dispatch = useAppDispatch()

  return useMutation({
    mutationFn: async (itemId: number) => {
      const response = await cartService.removeItem(itemId)
      
      // Si la respuesta contiene un nuevo token, actualizarlo en Redux
      if (response.accessToken) {
        dispatch(updateToken(response.accessToken))
      }
      
      return response
    },
    onSuccess: () => {
      // Invalidar el carrito para refrescar
      queryClient.invalidateQueries({ queryKey: ['cart'] })
    },
  })
}

// Hook para limpiar carrito
export const useClearCart = () => {
  const queryClient = useQueryClient()
  const dispatch = useAppDispatch()

  return useMutation({
    mutationFn: async () => {
      const response = await cartService.clearCart()
      
      // Si la respuesta contiene un nuevo token, actualizarlo en Redux
      if (response.accessToken) {
        dispatch(updateToken(response.accessToken))
      }
      
      return response
    },
    onSuccess: () => {
      // Invalidar el carrito para refrescar
      queryClient.invalidateQueries({ queryKey: ['cart'] })
    },
  })
}
