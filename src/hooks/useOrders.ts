import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { orderService } from '../services/orderService'
import { useAppDispatch } from '../store/hooks'
import { updateToken } from '../store/slices/authSlice'

// Hook para obtener pedidos del usuario
export const useOrders = () => {
  const dispatch = useAppDispatch()

  return useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const response = await orderService.getOrders()
      
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

// Hook para obtener un pedido específico
export const useOrder = (id: number) => {
  const dispatch = useAppDispatch()

  return useQuery({
    queryKey: ['order', id],
    queryFn: async () => {
      const response = await orderService.getOrderById(id)
      
      // Si la respuesta contiene un nuevo token, actualizarlo en Redux
      if (response.accessToken) {
        dispatch(updateToken(response.accessToken))
      }
      
      return response
    },
    enabled: !!id,
    staleTime: 2 * 60 * 1000,
    retry: 1,
  })
}

// Hook para crear pedido (checkout)
export const useCreateOrder = () => {
  const queryClient = useQueryClient()
  const dispatch = useAppDispatch()

  return useMutation({
    mutationFn: async (orderData: {
      direccionEnvio: string
      items: Array<{
        productId: number
        cantidad: number
      }>
    }) => {
      const response = await orderService.createOrder(orderData)
      
      // Si la respuesta contiene un nuevo token, actualizarlo en Redux
      if (response.accessToken) {
        dispatch(updateToken(response.accessToken))
      }
      
      return response
    },
    onSuccess: () => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      queryClient.invalidateQueries({ queryKey: ['cart'] })
    },
  })
}

// Hook para actualizar estado del pedido
export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient()
  const dispatch = useAppDispatch()

  return useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const response = await orderService.updateOrderStatus(id, status)
      
      // Si la respuesta contiene un nuevo token, actualizarlo en Redux
      if (response.accessToken) {
        dispatch(updateToken(response.accessToken))
      }
      
      return response
    },
    onSuccess: (_, { id }) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      queryClient.invalidateQueries({ queryKey: ['order', id] })
    },
  })
}
