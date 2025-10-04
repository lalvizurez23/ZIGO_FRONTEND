import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Register from './pages/Register'
import Products from './pages/Products'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Orders from './pages/Orders'
import { AuthProvider } from './contexts/AuthContext'
import { Toaster } from './utils/toast'

function App(): JSX.Element {
  return (
    <AuthProvider>
      <Toaster 
        position="top-right"
        reverseOrder={false}
        gutter={8}
        toastOptions={{
          duration: 3000,
        }}
      />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Layout />}>
            <Route index element={<Products />} />
            <Route path="/products" element={<Products />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/orders" element={<Orders />} />
          </Route>
        </Route>
      </Routes>
    </AuthProvider>
  )
}

export default App
