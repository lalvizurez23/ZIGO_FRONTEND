import { useMutation, useQueryClient } from '@tanstack/react-query'
import { checkoutService, CheckoutData } from '../services/checkoutService'
import { useAppDispatch } from '../store/hooks'
import { updateToken } from '../store/slices/authSlice'

export const useCheckout = () => {
  const queryClient = useQueryClient()
  const dispatch = useAppDispatch()

  return useMutation({
    mutationFn: async (data: CheckoutData) => {
      const response = await checkoutService.processCheckout(data)
      
      // Si la respuesta contiene un nuevo token, actualizarlo en Redux
      if (response.accessToken) {
        dispatch(updateToken(response.accessToken))
      }
      
      return response
    },
    onSuccess: () => {
      // Invalidar el carrito para que se recargue vacío
      queryClient.invalidateQueries({ queryKey: ['cart'] })
    },
  })
}
