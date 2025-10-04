import api from './api'

export interface CheckoutData {
  direccionEnvio: string
  numeroTarjeta: string
  nombreTarjeta: string
  fechaExpiracion: string
  cvv: string
}

export const checkoutService = {
  // Procesar checkout
  processCheckout: async (data: CheckoutData) => {
    const response = await api.post('/pedidos/checkout', data)
    return response.data
  },
}
