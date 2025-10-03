import api from './api'

export const productService = {
  // Get all products
  getProducts: async (params = {}) => {
    const response = await api.get('/productos', { params })
    return response.data
  },

  // Get product by ID
  getProduct: async (id) => {
    const response = await api.get(`/productos/${id}`)
    return response.data
  },

  // Create product (admin only)
  createProduct: async (productData) => {
    const response = await api.post('/productos', productData)
    return response.data
  },

  // Update product (admin only)
  updateProduct: async (id, productData) => {
    const response = await api.put(`/productos/${id}`, productData)
    return response.data
  },

  // Delete product (admin only)
  deleteProduct: async (id) => {
    const response = await api.delete(`/productos/${id}`)
    return response.data
  },

  // Get products by category
  getProductsByCategory: async (categoryId) => {
    const response = await api.get(`/productos/categoria/${categoryId}`)
    return response.data
  },

  // Search products
  searchProducts: async (query) => {
    const response = await api.get(`/productos/search?q=${query}`)
    return response.data
  }
}
