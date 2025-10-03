import api from './api'

export const orderService = {
  // Get all orders for the current user
  getOrders: async () => {
    const response = await api.get('/pedido')
    return response.data
  },

  // Get a single order by ID
  getOrderById: async (id: number) => {
    const response = await api.get(`/pedido/${id}`)
    return response.data
  },

  // Create a new order (checkout)
  createOrder: async (orderData: any) => {
    const response = await api.post('/pedido', orderData)
    return response.data
  },

  // Update order status (e.g., for admin)
  updateOrderStatus: async (id: number, status: string) => {
    const response = await api.patch(`/pedido/${id}/status`, { status })
    return response.data
  },
}
