import React from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { TextField, Button, Typography, Container, Box, Alert } from '@mui/material'

interface LoginFormData {
  email: string
  password: string
}

const schema = yup.object().shape({
  email: yup.string().email('Email inválido').required('Email es requerido'),
  password: yup.string().min(6, 'La contraseña debe tener al menos 6 caracteres').required('Contraseña es requerida'),
})

const Login: React.FC = () => {
  const { login, loading, error } = useAuth()
  const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: yupResolver(schema),
  })

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data)
      navigate('/products')
    } catch (err) {
      console.error('Login failed:', err)
    }
  }

  return (
    <Container component="main" maxWidth="xs" className="min-h-screen flex items-center justify-center bg-gray-50">
      <Box className="w-full p-8 space-y-6 bg-white rounded-lg shadow-md">
        <Typography component="h1" variant="h5" className="text-center text-zigo-dark-text">
          Iniciar Sesión
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <TextField
            {...register('email')}
            label="Email"
            variant="outlined"
            fullWidth
            autoComplete="email"
            error={!!errors.email}
            helperText={errors.email?.message}
          />
          <TextField
            {...register('password')}
            label="Contraseña"
            type="password"
            variant="outlined"
            fullWidth
            autoComplete="current-password"
            error={!!errors.password}
            helperText={errors.password?.message}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={loading}
            className="py-2 text-lg"
          >
            {loading ? 'Cargando...' : 'Entrar'}
          </Button>
        </form>
        <Typography variant="body2" className="text-center text-gray-600">
          ¿No tienes cuenta? <a href="/register" className="text-primary-500 hover:underline">Regístrate aquí</a>
        </Typography>
      </Box>
    </Container>
  )
}

export default Login
