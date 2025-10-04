import { useQuery } from '@tanstack/react-query'
import { orderService } from '../services/orderService'
import { useAppDispatch } from '../store/hooks'
import { updateToken } from '../store/slices/authSlice'

export const useOrders = () => {
  const dispatch = useAppDispatch()

  return useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const response = await orderService.getMyOrders()
      
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

export const useOrderById = (id: number) => {
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
    refetchOnWindowFocus: false,
  })
}