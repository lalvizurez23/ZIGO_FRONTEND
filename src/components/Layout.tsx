import React from 'react'
import { Outlet, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useUserProfile } from '../hooks/useAuth'
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import ExitToAppIcon from '@mui/icons-material/ExitToApp'
import PersonIcon from '@mui/icons-material/Person'

const Layout: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth()
  
  // Obtener perfil del usuario automáticamente si está autenticado
  useUserProfile()

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" className="bg-primary-500">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} className="font-bold text-white">
            <Link to="/" className="no-underline text-white">ZIGO</Link>
          </Typography>
          <Box>
            {isAuthenticated ? (
              <>
                <Button color="inherit" component={Link} to="/products" className="text-white">Productos</Button>
                <Button color="inherit" component={Link} to="/cart" startIcon={<ShoppingCartIcon />} className="text-white">Carrito</Button>
                <Button color="inherit" component={Link} to="/orders" className="text-white">Mis Pedidos</Button>
                <Button color="inherit" startIcon={<PersonIcon />} className="text-white">
                  {user?.nombre || 'Usuario'}
                </Button>
                <Button color="inherit" onClick={logout} startIcon={<ExitToAppIcon />} className="text-white">
                  Salir
                </Button>
              </>
            ) : (
              <>
                <Button color="inherit" component={Link} to="/login" className="text-white">Iniciar Sesión</Button>
                <Button color="inherit" component={Link} to="/register" className="text-white">Registrarse</Button>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      <main>
        <Outlet />
      </main>
    </Box>
  )
}

export default Layout
