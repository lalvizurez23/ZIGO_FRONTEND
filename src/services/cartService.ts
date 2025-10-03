import api from './api'

export const cartService = {
  // Get user's cart
  getCart: async () => {
    const response = await api.get('/carrito')
    return response.data
  },

  // Add item to cart
  addItem: async (productId: number, quantity: number) => {
    const response = await api.post('/carrito/item', { productId, quantity })
    return response.data
  },

  // Update item quantity in cart
  updateItem: async (itemId: number, quantity: number) => {
    const response = await api.patch(`/carrito/item/${itemId}`, { quantity })
    return response.data
  },

  // Remove item from cart
  removeItem: async (itemId: number) => {
    const response = await api.delete(`/carrito/item/${itemId}`)
    return response.data
  },

  // Clear cart
  clearCart: async () => {
    const response = await api.delete('/carrito/clear')
    return response.data
  },
}
