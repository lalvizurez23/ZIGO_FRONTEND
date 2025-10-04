import api from './api'

export const orderService = {
  // Obtener pedidos del usuario autenticado
  getMyOrders: async () => {
    const response = await api.get('/pedidos/mis-pedidos')
    return response.data
  },

  // Obtener un pedido específico
  getOrderById: async (id: number) => {
    const response = await api.get(`/pedidos/${id}`)
    return response.data
  },
}