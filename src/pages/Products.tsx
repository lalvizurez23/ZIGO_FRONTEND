import React, { useState, useEffect, useRef } from 'react'
import { useProducts } from '../hooks/useProducts'
import { useAddToCart } from '../hooks/useCart'
import { ShoppingCart, Search, FilterList, Add } from '@mui/icons-material'
import { Product } from '../types'
import LoadingSpinner from '../components/LoadingSpinner'
import showToast from '../utils/toast'

const Products: React.FC = () => {
  const [inputValue, setInputValue] = useState('') // Valor del input (sin debounce)
  const [searchTerm, setSearchTerm] = useState('') // Término de búsqueda real (con debounce)
  const searchInputRef = useRef<HTMLInputElement>(null)

  // TanStack Query maneja TODOS los datos del backend
  const { data: productsData, isLoading, error, refetch } = useProducts({
    search: searchTerm,
    categoria: ''
  })

  // Hook para agregar al carrito
  const addToCartMutation = useAddToCart()

  // Los productos vienen directamente del backend via TanStack Query
  // Asegurar que siempre es un array
  const products: Product[] = Array.isArray(productsData) ? productsData : []

  // Búsqueda inmediata cuando se ingresen 3+ caracteres
  useEffect(() => {
    if (inputValue.length >= 3) {
      setSearchTerm(inputValue)
    } else if (inputValue.length === 0) {
      setSearchTerm('') // Limpiar búsqueda si se borra todo
    }
  }, [inputValue])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  const handleAddToCart = async (productId: number) => {
    try {
      await addToCartMutation.mutateAsync({ productId, quantity: 1 })
      showToast.success('Producto agregado al carrito')
    } catch (error) {
      const errorMessage = (error as Error).message || 'Error al agregar al carrito'
      showToast.error(errorMessage)
      console.error('Error al agregar al carrito:', error)
    }
  }

  // Mantener el foco del input después de cada render
  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isLoading])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner message="Cargando productos..." size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error al cargar productos</h2>
          <p className="text-gray-600">{error.message}</p>
          <button 
            onClick={() => refetch()}
            className="mt-4 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
          >
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">Productos</h1>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Buscar productos... (mín. 3 caracteres)"
                  value={inputValue}
                  onChange={handleSearchChange}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                {inputValue.length >= 3 && isLoading && (
                  <div className="absolute -bottom-6 left-0 text-xs text-primary-500">
                    Buscando...
                  </div>
                )}
              </div>
              <button className="btn-secondary flex items-center">
                <FilterList className="h-5 w-5 mr-2" />
                Filtros
              </button>
              <button className="btn-primary flex items-center">
                <ShoppingCart className="h-5 w-5 mr-2" />
                Carrito
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="container mx-auto px-4 py-8">
        {/* Contador de resultados */}
        {searchTerm && (
          <div className="mb-6">
            <p className="text-gray-600">
              {isLoading ? (
                'Buscando productos...'
              ) : (
                `${products.length} producto${products.length !== 1 ? 's' : ''} encontrado${products.length !== 1 ? 's' : ''} para "${searchTerm}"`
              )}
            </p>
          </div>
        )}
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product: Product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <img
                src={product.imageUrl || 'https://via.placeholder.com/300'}
                alt={product.nombre}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-1">{product.nombre}</h3>
                <p className="text-gray-600 text-sm mb-2">{product.descripcion}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-primary-600">Q{product.precio}</span>
                  <button 
                    className="btn-primary text-sm px-3 py-1 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => handleAddToCart(product.id)}
                    disabled={addToCartMutation.isPending || product.stock === 0}
                  >
                    {addToCartMutation.isPending ? (
                      <LoadingSpinner size="sm" />
                    ) : (
                      <>
                        <Add className="h-4 w-4 mr-1" />
                        {product.stock === 0 ? 'Sin Stock' : 'Añadir'}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Products
