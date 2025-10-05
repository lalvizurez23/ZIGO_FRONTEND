import React from 'react'
import { useForm } from '@tanstack/react-form'
import { z } from 'zod'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { TextField, Button, Typography, Container, Box } from '@mui/material'
import showToast from '../utils/toast'

// Schema de validación con Zod
const loginSchema = z.object({
  email: z.string()
    .min(1, 'Email es requerido')
    .email('Email inválido'),
  password: z.string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .max(100, 'La contraseña es demasiado larga'),
})

const Login: React.FC = () => {
  const { login, loading } = useAuth()
  const navigate = useNavigate()

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    onSubmit: async ({ value }) => {
      // Validar con Zod antes de enviar
      const result = loginSchema.safeParse(value)
      if (!result.success) {
        const firstError = result.error.issues[0]
        showToast.error(firstError.message)
        return
      }

      try {
        await login(value)
        showToast.success('¡Bienvenido! Sesión iniciada correctamente')
        navigate('/products')
      } catch (err) {
        const errorMessage = (err as Error).message || 'Error al iniciar sesión'
        showToast.error(errorMessage)
        console.error('Login failed:', err)
      }
    },
  })

  return (
    <Container component="main" maxWidth="xs" className="min-h-screen flex items-center justify-center bg-gray-50">
      <Box className="w-full p-8 space-y-6 bg-white rounded-lg shadow-md">
        <Typography component="h1" variant="h5" className="text-center text-zigo-dark-text">
          Iniciar Sesión
        </Typography>
        
        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
          className="space-y-4"
        >
          {/* Campo Email */}
          <form.Field
            name="email"
            validators={{
              onChange: ({ value }) => {
                const result = loginSchema.shape.email.safeParse(value)
                return result.success ? undefined : result.error.issues[0]?.message
              },
            }}
            children={(field) => (
              <TextField
                id="email"
                name={field.name}
                label="Email"
                type="email"
                variant="outlined"
                fullWidth
                autoComplete="email"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                error={field.state.meta.isTouched && !!field.state.meta.errors.length}
                helperText={
                  field.state.meta.isTouched && field.state.meta.errors.length > 0
                    ? String(field.state.meta.errors[0])
                    : ''
                }
                inputProps={{
                  'aria-label': 'Email',
                  'aria-required': 'true',
                  'aria-invalid': field.state.meta.isTouched && !!field.state.meta.errors.length,
                  'aria-describedby': field.state.meta.errors.length > 0 ? 'email-error' : undefined,
                }}
              />
            )}
          />

          {/* Campo Password */}
          <form.Field
            name="password"
            validators={{
              onChange: ({ value }) => {
                const result = loginSchema.shape.password.safeParse(value)
                return result.success ? undefined : result.error.issues[0]?.message
              },
            }}
            children={(field) => (
              <TextField
                id="password"
                name={field.name}
                label="Contraseña"
                type="password"
                variant="outlined"
                fullWidth
                autoComplete="current-password"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                error={field.state.meta.isTouched && !!field.state.meta.errors.length}
                helperText={
                  field.state.meta.isTouched && field.state.meta.errors.length > 0
                    ? String(field.state.meta.errors[0])
                    : ''
                }
                inputProps={{
                  'aria-label': 'Contraseña',
                  'aria-required': 'true',
                  'aria-invalid': field.state.meta.isTouched && !!field.state.meta.errors.length,
                  'aria-describedby': field.state.meta.errors.length > 0 ? 'password-error' : undefined,
                }}
              />
            )}
          />

          {/* Botón Submit */}
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
            children={([canSubmit, isSubmitting]) => (
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                disabled={!canSubmit || isSubmitting || loading}
                className="py-2 text-lg"
                aria-label="Iniciar sesión"
              >
                {isSubmitting || loading ? 'Cargando...' : 'Entrar'}
              </Button>
            )}
          />
        </form>

        <Typography variant="body2" className="text-center text-gray-600">
          ¿No tienes cuenta? <a href="/register" className="text-primary-500 hover:underline">Regístrate aquí</a>
        </Typography>
      </Box>
    </Container>
  )
}

export default Login