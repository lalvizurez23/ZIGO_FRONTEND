import api from './api'

export const orderService = {
  // Get user's orders
  getOrders: async () => {
    const response = await api.get('/pedidos')
    return response.data
  },

  // Get order by ID
  getOrder: async (id) => {
    const response = await api.get(`/pedidos/${id}`)
    return response.data
  },

  // Create order (checkout)
  createOrder: async (orderData) => {
    const response = await api.post('/pedidos', orderData)
    return response.data
  },

  // Update order status (admin only)
  updateOrderStatus: async (id, status) => {
    const response = await api.put(`/pedidos/${id}/estado`, { estado: status })
    return response.data
  },

  // Cancel order
  cancelOrder: async (id) => {
    const response = await api.put(`/pedidos/${id}/cancelar`)
    return response.data
  }
}
