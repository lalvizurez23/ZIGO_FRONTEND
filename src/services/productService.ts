import api from './api'

interface ProductParams {
  search?: string
  categoria?: string
  page?: number
  limit?: number
}

export const productService = {
  // Get all products
  getProducts: async (params?: ProductParams) => {
    const response = await api.get('/productos', { params })
    return response.data
  },

  // Get a single product by ID
  getProductById: async (id: number) => {
    const response = await api.get(`/productos/${id}`)
    return response.data
  },

  // Create a new product
  createProduct: async (productData: any) => {
    const response = await api.post('/productos', productData)
    return response.data
  },

  // Update an existing product
  updateProduct: async (id: number, productData: any) => {
    const response = await api.patch(`/productos/${id}`, productData)
    return response.data
  },

  // Delete a product
  deleteProduct: async (id: number) => {
    const response = await api.delete(`/productos/${id}`)
    return response.data
  },
}
