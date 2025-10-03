import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { cartService } from '../services/cartService'
import { useAppDispatch } from '../store/hooks'
import { updateToken } from '../store/slices/authSlice'

// Hook para obtener carrito
export const useCart = () => {
  const dispatch = useAppDispatch()

  return useQuery({
    queryKey: ['cart'],
    queryFn: async () => {
      const response = await cartService.getCart()
      
      // Si la respuesta contiene un nuevo token, actualizarlo en Redux
      if (response.accessToken) {
        dispatch(updateToken(response.accessToken))
      }
      
      return response
    },
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
      const response = await cartService.addItem(productId, quantity)
      
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
