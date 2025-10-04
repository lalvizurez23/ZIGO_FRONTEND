import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart, useUpdateCartItem, useRemoveFromCart, useClearCart } from '../hooks/useCart'
import { Add, Remove, Delete, ShoppingCart } from '@mui/icons-material'
import LoadingSpinner from '../components/LoadingSpinner'
import { CartItem } from '../types'
import showToast from '../utils/toast'

const Cart: React.FC = () => {
  const navigate = useNavigate()
  // TanStack Query maneja los datos del carrito del backend
  const { data: cartData, isLoading, error } = useCart()
  const updateItemMutation = useUpdateCartItem()
  const removeItemMutation = useRemoveFromCart()
  const clearCartMutation = useClearCart()

  const handleUpdateQuantity = async (itemId: number, newQuantity: number) => {
    if (newQuantity <= 0) return
    try {
      await updateItemMutation.mutateAsync({ itemId, quantity: newQuantity })
      showToast.success('Cantidad actualizada')
    } catch (error) {
      const errorMessage = (error as Error).message || 'Error al actualizar cantidad'
      showToast.error(errorMessage)
      console.error('Error al actualizar cantidad:', error)
    }
  }

  const handleRemoveItem = async (itemId: number) => {
    try {
      await removeItemMutation.mutateAsync(itemId)
      showToast.success('Producto eliminado del carrito')
    } catch (error) {
      const errorMessage = (error as Error).message || 'Error al eliminar producto'
      showToast.error(errorMessage)
      console.error('Error al eliminar item:', error)
    }
  }

  const handleClearCart = async () => {
    if (window.confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
      try {
        await clearCartMutation.mutateAsync()
        showToast.success('Carrito vaciado correctamente')
      } catch (error) {
        const errorMessage = (error as Error).message || 'Error al vaciar carrito'
        showToast.error(errorMessage)
        console.error('Error al vaciar carrito:', error)
      }
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner message="Cargando carrito..." size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error al cargar carrito</h2>
          <p className="text-gray-600">{error.message}</p>
        </div>
      </div>
    )
  }

  const cartItems: CartItem[] = cartData?.items || [];
  const total = cartItems.reduce((sum, item) => {
    const precio = typeof item.producto?.precio === 'string' 
      ? parseFloat(item.producto.precio) 
      : (item.producto?.precio || 0)
    return sum + precio * item.cantidad
  }, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Carrito de Compras</h1>
        
        {cartItems.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingCart className="mx-auto h-24 w-24 text-gray-300 mb-4" />
            <h2 className="text-xl text-gray-600 mb-4">Tu carrito está vacío</h2>
            <p className="text-gray-500">Agrega algunos productos para comenzar</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                {cartItems.length} producto{cartItems.length !== 1 ? 's' : ''} en el carrito
              </h2>
              <button
                onClick={handleClearCart}
                disabled={clearCartMutation.isPending}
                className="text-red-600 hover:text-red-800 disabled:opacity-50 flex items-center"
              >
                <Delete className="h-4 w-4 mr-1" />
                Vaciar carrito
              </button>
            </div>
            
            <div className="space-y-4">
              {cartItems.map((item: CartItem) => (
                <div key={item.idCarritoItem} className="flex items-center justify-between border-b pb-4">
                  <div className="flex items-center space-x-4">
                    <img
                      src={item.producto?.imagenUrl || 'https://via.placeholder.com/100'}
                      alt={item.producto?.nombre}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-800">{item.producto?.nombre}</h3>
                      <p className="text-gray-600 text-sm">{item.producto?.descripcion}</p>
                      <p className="text-primary-600 font-semibold">
                        Q{typeof item.producto?.precio === 'string' 
                          ? parseFloat(item.producto.precio).toFixed(2) 
                          : (item.producto?.precio || 0).toFixed(2)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleUpdateQuantity(item.idCarritoItem, item.cantidad - 1)}
                        disabled={updateItemMutation.isPending || item.cantidad <= 1}
                        className="p-1 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Remove className="h-4 w-4" />
                      </button>
                      <span className="w-8 text-center font-semibold">{item.cantidad}</span>
                      <button
                        onClick={() => handleUpdateQuantity(item.idCarritoItem, item.cantidad + 1)}
                        disabled={updateItemMutation.isPending || item.cantidad >= (item.producto?.stock || 0)}
                        className="p-1 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Add className="h-4 w-4" />
                      </button>
                    </div>
                    
                    <div className="text-right min-w-[100px]">
                      <p className="font-bold text-lg">
                        Q{(() => {
                          const precio = typeof item.producto?.precio === 'string' 
                            ? parseFloat(item.producto.precio) 
                            : (item.producto?.precio || 0)
                          return (precio * item.cantidad).toFixed(2)
                        })()}
                      </p>
                    </div>
                    
                    <button
                      onClick={() => handleRemoveItem(item.idCarritoItem)}
                      disabled={removeItemMutation.isPending}
                      className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-full disabled:opacity-50"
                    >
                      <Delete className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 pt-4 border-t">
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold">Total:</span>
                <span className="text-2xl font-bold text-primary-600">
                  Q{total.toFixed(2)}
                </span>
              </div>
              <div className="mt-4 flex space-x-4">
                <button 
                  onClick={() => navigate('/products')}
                  className="btn-secondary flex-1"
                >
                  Continuar comprando
                </button>
                <button 
                  onClick={() => navigate('/checkout')}
                  className="btn-primary flex-1"
                >
                  Proceder al pago
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Cart
