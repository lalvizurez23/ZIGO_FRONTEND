import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from '@tanstack/react-form'
import { useCart } from '../hooks/useCart'
import { useCheckout } from '../hooks/useCheckout'
import { CreditCard, LocationOn, CheckCircle } from '@mui/icons-material'
import LoadingSpinner from '../components/LoadingSpinner'
import { CartItem } from '../types'
import showToast from '../utils/toast'

const Checkout: React.FC = () => {
  const navigate = useNavigate()
  const { data: cartData, isLoading: cartLoading } = useCart()
  const checkoutMutation = useCheckout()
  const [showSuccess, setShowSuccess] = useState(false)

  const form = useForm({
    defaultValues: {
      direccionEnvio: '',
      numeroTarjeta: '',
      nombreTarjeta: '',
      fechaExpiracion: '',
      cvv: '',
    },
    onSubmit: async ({ value }) => {
      try {
        await checkoutMutation.mutateAsync(value)
        setShowSuccess(true)
        showToast.success('¡Pedido realizado exitosamente!')
        // Redirigir a productos después de 3 segundos
        setTimeout(() => {
          navigate('/products')
        }, 3000)
      } catch (error) {
        const errorMessage = (error as Error).message || 'Error al procesar el pago'
        showToast.error(errorMessage)
        console.error('Error en checkout:', error)
      }
    },
  })

  if (cartLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner message="Cargando..." size="lg" />
      </div>
    )
  }

  const cartItems: CartItem[] = cartData?.items || []
  const total = cartItems.reduce((sum: number, item: CartItem) => {
    const precio = typeof item.producto?.precio === 'string' 
      ? parseFloat(item.producto.precio) 
      : (item.producto?.precio || 0)
    return sum + precio * item.cantidad
  }, 0)

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Tu carrito está vacío</h2>
          <p className="text-gray-600 mb-4">Agrega productos antes de proceder al pago</p>
          <button
            onClick={() => navigate('/products')}
            className="btn-primary"
          >
            Ver Productos
          </button>
        </div>
      </div>
    )
  }

  if (showSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg">
          <CheckCircle className="mx-auto h-24 w-24 text-green-500 mb-4" />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">¡Pedido Realizado!</h2>
          <p className="text-gray-600 mb-2">Tus artículos han sido pedidos correctamente</p>
          <p className="text-sm text-gray-500">Redirigiendo a productos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Finalizar Compra</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulario de Pago */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                <CreditCard className="h-6 w-6 mr-2" />
                Información de Pago
              </h2>

              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  form.handleSubmit()
                }}
                className="space-y-6"
              >
                {/* Dirección de Envío */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <LocationOn className="h-5 w-5 mr-1" />
                    Dirección de Envío
                  </label>
                  <form.Field
                    name="direccionEnvio"
                    validators={{
                      onChange: ({ value }) =>
                        !value ? 'La dirección es requerida' : undefined,
                    }}
                  >
                    {(field) => (
                      <div>
                        <textarea
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                          rows={3}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="Ingresa tu dirección completa"
                        />
                        {field.state.meta.errors && (
                          <p className="text-red-500 text-sm mt-1">
                            {field.state.meta.errors[0]}
                          </p>
                        )}
                      </div>
                    )}
                  </form.Field>
                </div>

                {/* Nombre en la Tarjeta */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre en la Tarjeta
                  </label>
                  <form.Field
                    name="nombreTarjeta"
                    validators={{
                      onChange: ({ value }) =>
                        !value ? 'El nombre es requerido' : undefined,
                    }}
                  >
                    {(field) => (
                      <div>
                        <input
                          type="text"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="JUAN PÉREZ"
                        />
                        {field.state.meta.errors && (
                          <p className="text-red-500 text-sm mt-1">
                            {field.state.meta.errors[0]}
                          </p>
                        )}
                      </div>
                    )}
                  </form.Field>
                </div>

                {/* Número de Tarjeta */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Número de Tarjeta
                  </label>
                  <form.Field
                    name="numeroTarjeta"
                    validators={{
                      onChange: ({ value }) => {
                        if (!value) return 'El número de tarjeta es requerido'
                        if (value.replace(/\s/g, '').length !== 16)
                          return 'El número de tarjeta debe tener 16 dígitos'
                        return undefined
                      },
                    }}
                  >
                    {(field) => (
                      <div>
                        <input
                          type="text"
                          value={field.state.value}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '')
                            const formatted = value.replace(/(\d{4})/g, '$1 ').trim()
                            field.handleChange(formatted.slice(0, 19))
                          }}
                          onBlur={field.handleBlur}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="1234 5678 9012 3456"
                          maxLength={19}
                        />
                        {field.state.meta.errors && (
                          <p className="text-red-500 text-sm mt-1">
                            {field.state.meta.errors[0]}
                          </p>
                        )}
                      </div>
                    )}
                  </form.Field>
                </div>

                {/* Fecha de Expiración y CVV */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fecha de Expiración
                    </label>
                    <form.Field
                      name="fechaExpiracion"
                      validators={{
                        onChange: ({ value }) => {
                          if (!value) return 'La fecha es requerida'
                          if (!/^\d{2}\/\d{2}$/.test(value))
                            return 'Formato inválido (MM/YY)'
                          return undefined
                        },
                      }}
                    >
                      {(field) => (
                        <div>
                          <input
                            type="text"
                            value={field.state.value}
                            onChange={(e) => {
                              let value = e.target.value.replace(/\D/g, '')
                              if (value.length >= 2) {
                                value = value.slice(0, 2) + '/' + value.slice(2, 4)
                              }
                              field.handleChange(value)
                            }}
                            onBlur={field.handleBlur}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            placeholder="MM/YY"
                            maxLength={5}
                          />
                          {field.state.meta.errors && (
                            <p className="text-red-500 text-sm mt-1">
                              {field.state.meta.errors[0]}
                            </p>
                          )}
                        </div>
                      )}
                    </form.Field>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CVV
                    </label>
                    <form.Field
                      name="cvv"
                      validators={{
                        onChange: ({ value }) => {
                          if (!value) return 'El CVV es requerido'
                          if (value.length !== 3) return 'El CVV debe tener 3 dígitos'
                          return undefined
                        },
                      }}
                    >
                      {(field) => (
                        <div>
                          <input
                            type="text"
                            value={field.state.value}
                            onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, '')
                              field.handleChange(value.slice(0, 3))
                            }}
                            onBlur={field.handleBlur}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            placeholder="123"
                            maxLength={3}
                          />
                          {field.state.meta.errors && (
                            <p className="text-red-500 text-sm mt-1">
                              {field.state.meta.errors[0]}
                            </p>
                          )}
                        </div>
                      )}
                    </form.Field>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={checkoutMutation.isPending}
                    className="w-full btn-primary py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {checkoutMutation.isPending ? (
                      <span className="flex items-center justify-center">
                        <LoadingSpinner size="sm" />
                        <span className="ml-2">Procesando...</span>
                      </span>
                    ) : (
                      `Pagar Q${total.toFixed(2)}`
                    )}
                  </button>
                </div>

                {checkoutMutation.isError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                    {(checkoutMutation.error as any)?.response?.data?.message || 
                      'Error al procesar el pago. Por favor, intenta nuevamente.'}
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* Resumen del Pedido */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Resumen del Pedido
              </h2>

              <div className="space-y-3 mb-4">
                {cartItems.map((item: CartItem) => {
                  const precio = typeof item.producto?.precio === 'string' 
                    ? parseFloat(item.producto.precio) 
                    : (item.producto?.precio || 0)
                  
                  return (
                    <div key={item.idCarritoItem} className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {item.producto?.nombre} x {item.cantidad}
                      </span>
                      <span className="font-semibold">
                        Q{(precio * item.cantidad).toFixed(2)}
                      </span>
                    </div>
                  )
                })}
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-primary-600">Q{total.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-6 text-xs text-gray-500">
                <p className="mb-2">🔒 Pago seguro y encriptado</p>
                <p>Al completar tu compra, aceptas nuestros términos y condiciones.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout