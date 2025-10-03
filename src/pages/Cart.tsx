import React from 'react'
import { useCart } from '../hooks/useCart'
import LoadingSpinner from '../components/LoadingSpinner'

const Cart: React.FC = () => {
  // TanStack Query maneja los datos del carrito del backend
  const { data: cartData, isLoading, error } = useCart()

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

  const cartItems = cartData?.items || []

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Carrito de Compras</h1>
        
        {cartItems.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl text-gray-600 mb-4">Tu carrito está vacío</h2>
            <p className="text-gray-500">Agrega algunos productos para comenzar</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="space-y-4">
              {cartItems.map((item: any) => (
                <div key={item.id} className="flex items-center justify-between border-b pb-4">
                  <div className="flex items-center space-x-4">
                    <img
                      src={item.producto?.imageUrl || 'https://via.placeholder.com/100'}
                      alt={item.producto?.nombre}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-800">{item.producto?.nombre}</h3>
                      <p className="text-gray-600">Cantidad: {item.quantity}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">${(item.precio * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t">
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold">Total:</span>
                <span className="text-2xl font-bold text-primary-600">
                  ${cartData?.total?.toFixed(2) || '0.00'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Cart
