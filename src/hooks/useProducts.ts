import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { productService } from '../services/productService'
import { useAppDispatch } from '../store/hooks'
import { updateToken } from '../store/slices/authSlice'
import { Product } from '../types'

interface ProductParams {
  search?: string
  categoria?: string
  page?: number
  limit?: number
}

// Hook para obtener productos - TanStack Query maneja los datos del backend
export const useProducts = (params: ProductParams = {}) => {
  const dispatch = useAppDispatch()

  return useQuery({
    queryKey: ['products', params],
    queryFn: async () => {
      const response = await productService.getProducts(params)
      
      // Verificar estructura de respuesta del backend
      
      // Solo actualizar token en Redux si viene del backend
      if (response.accessToken) {
        dispatch(updateToken(response.accessToken))
      }
      
      // Asegurar que siempre retornamos un array de productos válidos
      let products = []
      
      if (Array.isArray(response)) {
        products = response
      } else if (response && Array.isArray(response.data)) {
        products = response.data
      } else {
        console.warn('Respuesta inesperada del backend:', response)
        return []
      }
      
      // Mapear los productos del backend al formato esperado por el frontend
      // El backend devuelve {idProducto, idCat} pero necesitamos {id, nombre, descripcion, precio, imageUrl}
      const mappedProducts = products.map((product: any) => ({
        id: product.idProducto || product.id,
        nombre: product.nombre || `Producto ${product.idProducto || product.id}`,
        descripcion: product.descripcion || 'Descripción no disponible',
        precio: product.precio || 0,
        stock: product.stock || 0,
        imageUrl: product.imageUrl || 'https://via.placeholder.com/300',
        idCategoria: product.idCat || product.idCategoria || 1,
        categoria: product.categoria || { id: product.idCat || 1, nombre: 'Sin categoría' }
      }))
      
      return mappedProducts
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: 1,
    refetchOnWindowFocus: false,
  })
}

// Hook para obtener un producto específico
export const useProduct = (id: number) => {
  const dispatch = useAppDispatch()

  return useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const response = await productService.getProductById(id)
      
      // Si la respuesta contiene un nuevo token, actualizarlo en Redux
      if (response.accessToken) {
        dispatch(updateToken(response.accessToken))
      }
      
      return response
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  })
}

// Hook para crear producto
export const useCreateProduct = () => {
  const queryClient = useQueryClient()
  const dispatch = useAppDispatch()

  return useMutation({
    mutationFn: async (productData: Omit<Product, 'id'>) => {
      const response = await productService.createProduct(productData)
      
      // Si la respuesta contiene un nuevo token, actualizarlo en Redux
      if (response.accessToken) {
        dispatch(updateToken(response.accessToken))
      }
      
      return response
    },
    onSuccess: () => {
      // Invalidar la lista de productos para refrescar
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
}

// Hook para actualizar producto
export const useUpdateProduct = () => {
  const queryClient = useQueryClient()
  const dispatch = useAppDispatch()

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<Product> }) => {
      const response = await productService.updateProduct(id, data)
      
      // Si la respuesta contiene un nuevo token, actualizarlo en Redux
      if (response.accessToken) {
        dispatch(updateToken(response.accessToken))
      }
      
      return response
    },
    onSuccess: (_, { id }) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({ queryKey: ['product', id] })
    },
  })
}

// Hook para eliminar producto
export const useDeleteProduct = () => {
  const queryClient = useQueryClient()
  const dispatch = useAppDispatch()

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await productService.deleteProduct(id)
      
      // Si la respuesta contiene un nuevo token, actualizarlo en Redux
      if (response.accessToken) {
        dispatch(updateToken(response.accessToken))
      }
      
      return response
    },
    onSuccess: () => {
      // Invalidar la lista de productos
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
}
