import React from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { TextField, Button, Typography, Container, Box, Alert } from '@mui/material'

interface RegisterFormData {
  nombre: string
  apellido: string
  email: string
  password: string
  telefono: string
  direccion: string
}

const schema = yup.object().shape({
  nombre: yup.string().required('Nombre es requerido'),
  apellido: yup.string().required('Apellido es requerido'),
  email: yup.string().email('Email inválido').required('Email es requerido'),
  password: yup.string().min(6, 'La contraseña debe tener al menos 6 caracteres').required('Contraseña es requerida'),
  telefono: yup.string().required('Teléfono es requerido'),
  direccion: yup.string().required('Dirección es requerida'),
})

const Register: React.FC = () => {
  const { register: authRegister, loading, error } = useAuth()
  const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
    resolver: yupResolver(schema),
  })

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await authRegister(data)
      navigate('/products')
    } catch (err) {
      console.error('Registration failed:', err)
    }
  }

  return (
    <Container component="main" maxWidth="sm" className="min-h-screen flex items-center justify-center bg-gray-50">
      <Box className="w-full p-8 space-y-6 bg-white rounded-lg shadow-md">
        <Typography component="h1" variant="h5" className="text-center text-zigo-dark-text">
          Registrarse
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <TextField
            {...register('nombre')}
            label="Nombre"
            variant="outlined"
            fullWidth
            error={!!errors.nombre}
            helperText={errors.nombre?.message}
          />
          <TextField
            {...register('apellido')}
            label="Apellido"
            variant="outlined"
            fullWidth
            error={!!errors.apellido}
            helperText={errors.apellido?.message}
          />
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
            autoComplete="new-password"
            error={!!errors.password}
            helperText={errors.password?.message}
          />
          <TextField
            {...register('telefono')}
            label="Teléfono"
            variant="outlined"
            fullWidth
            error={!!errors.telefono}
            helperText={errors.telefono?.message}
          />
          <TextField
            {...register('direccion')}
            label="Dirección"
            variant="outlined"
            fullWidth
            error={!!errors.direccion}
            helperText={errors.direccion?.message}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={loading}
            className="py-2 text-lg"
          >
            {loading ? 'Cargando...' : 'Registrarse'}
          </Button>
        </form>
        <Typography variant="body2" className="text-center text-gray-600">
          ¿Ya tienes cuenta? <a href="/login" className="text-primary-500 hover:underline">Inicia Sesión</a>
        </Typography>
      </Box>
    </Container>
  )
}

export default Register
