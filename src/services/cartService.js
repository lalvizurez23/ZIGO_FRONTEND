import api from './api'

export const cartService = {
  // Get user's cart
  getCart: async () => {
    const response = await api.get('/carrito')
    return response.data
  },

  // Add item to cart
  addToCart: async (productId, quantity = 1) => {
    const response = await api.post('/carrito/items', {
      idProducto: productId,
      cantidad: quantity
    })
    return response.data
  },

  // Update cart item quantity
  updateCartItem: async (itemId, quantity) => {
    const response = await api.put(`/carrito/items/${itemId}`, {
      cantidad: quantity
    })
    return response.data
  },

  // Remove item from cart
  removeFromCart: async (itemId) => {
    const response = await api.delete(`/carrito/items/${itemId}`)
    return response.data
  },

  // Clear cart
  clearCart: async () => {
    const response = await api.delete('/carrito')
    return response.data
  }
}
