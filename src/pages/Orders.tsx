import React from 'react'
import { useOrders } from '../hooks/useOrders'
import { ShoppingBag, LocalShipping, CheckCircle, Cancel } from '@mui/icons-material'
import LoadingSpinner from '../components/LoadingSpinner'
import { Order } from '../types'

const Orders: React.FC = () => {
  const { data: orders, isLoading, error } = useOrders()

  const getEstadoBadge = (estado: string) => {
    const estados: Record<string, { color: string; icon: JSX.Element; text: string }> = {
      pendiente: {
        color: 'bg-yellow-100 text-yellow-800',
        icon: <LocalShipping className="h-4 w-4" />,
        text: 'Pendiente',
      },
      procesando: {
        color: 'bg-blue-100 text-blue-800',
        icon: <LocalShipping className="h-4 w-4" />,
        text: 'Procesando',
      },
      completado: {
        color: 'bg-green-100 text-green-800',
        icon: <CheckCircle className="h-4 w-4" />,
        text: 'Completado',
      },
      cancelado: {
        color: 'bg-red-100 text-red-800',
        icon: <Cancel className="h-4 w-4" />,
        text: 'Cancelado',
      },
    }

    const estadoInfo = estados[estado] || estados.pendiente

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${estadoInfo.color}`}>
        {estadoInfo.icon}
        <span className="ml-1">{estadoInfo.text}</span>
      </span>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner message="Cargando pedidos..." size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error al cargar pedidos</h2>
          <p className="text-gray-600">{(error as Error).message}</p>
        </div>
      </div>
    )
  }

  const ordersList: Order[] = Array.isArray(orders) ? orders : []

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Historial de Pedidos</h1>

        {ordersList.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <ShoppingBag className="mx-auto h-24 w-24 text-gray-300 mb-4" />
            <h2 className="text-xl text-gray-600 mb-4">No tienes pedidos aún</h2>
            <p className="text-gray-500">Tus pedidos aparecerán aquí después de realizar una compra</p>
          </div>
        ) : (
          <div className="space-y-6">
            {ordersList.map((order: Order) => {
              const total = typeof order.total === 'string' ? parseFloat(order.total) : order.total
              
              return (
                <div key={order.idPedido} className="bg-white rounded-lg shadow-md overflow-hidden">
                  {/* Header del Pedido */}
                  <div className="bg-gray-50 px-6 py-4 border-b">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Pedido #{order.numeroPedido}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {new Date(order.fechaPedido).toLocaleDateString('es-GT', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        {getEstadoBadge(order.estado)}
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Total</p>
                          <p className="text-2xl font-bold text-primary-600">
                            Q{total.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Detalles del Pedido */}
                  <div className="px-6 py-4">
                    {/* Información de Envío */}
                    {order.direccionEnvio && (
                      <div className="mb-4 pb-4 border-b">
                        <p className="text-sm font-medium text-gray-700 mb-1">Dirección de Envío:</p>
                        <p className="text-sm text-gray-600">{order.direccionEnvio}</p>
                      </div>
                    )}

                    {/* Método de Pago */}
                    {order.metodoPago && (
                      <div className="mb-4 pb-4 border-b">
                        <p className="text-sm font-medium text-gray-700 mb-1">Método de Pago:</p>
                        <p className="text-sm text-gray-600">{order.metodoPago}</p>
                        {order.notas && (
                          <p className="text-xs text-gray-500 mt-1">{order.notas}</p>
                        )}
                      </div>
                    )}

                    {/* Items del Pedido */}
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-3">Productos:</p>
                      <div className="space-y-3">
                        {order.detalles.map((detalle) => {
                          const precioUnitario = typeof detalle.precioUnitario === 'string' 
                            ? parseFloat(detalle.precioUnitario) 
                            : detalle.precioUnitario
                          const subtotal = typeof detalle.subtotal === 'string' 
                            ? parseFloat(detalle.subtotal) 
                            : detalle.subtotal

                          return (
                            <div
                              key={detalle.idDetallePedido}
                              className="flex items-center justify-between py-2 border-b last:border-b-0"
                            >
                              <div className="flex items-center space-x-4">
                                <img
                                  src={detalle.producto?.imagenUrl || 'https://via.placeholder.com/60'}
                                  alt={detalle.producto?.nombre}
                                  className="w-16 h-16 object-cover rounded"
                                />
                                <div>
                                  <p className="font-medium text-gray-900">
                                    {detalle.producto?.nombre}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    Cantidad: {detalle.cantidad} x Q{precioUnitario.toFixed(2)}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold text-gray-900">
                                  Q{subtotal.toFixed(2)}
                                </p>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default Orders