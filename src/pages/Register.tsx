import React from 'react'
import { useForm } from '@tanstack/react-form'
import { z } from 'zod'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { TextField, Button, Typography, Container, Box } from '@mui/material'
import showToast from '../utils/toast'

// Schema de validación con Zod
const registerSchema = z.object({
  nombre: z.string()
    .min(1, 'Nombre es requerido')
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre es demasiado largo'),
  apellido: z.string()
    .min(1, 'Apellido es requerido')
    .min(2, 'El apellido debe tener al menos 2 caracteres')
    .max(100, 'El apellido es demasiado largo'),
  email: z.string()
    .min(1, 'Email es requerido')
    .email('Email inválido'),
  password: z.string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .max(100, 'La contraseña es demasiado larga'),
  telefono: z.string()
    .min(1, 'Teléfono es requerido')
    .min(8, 'El teléfono debe tener al menos 8 dígitos'),
  direccion: z.string()
    .min(1, 'Dirección es requerida')
    .min(10, 'La dirección debe ser más específica'),
})

const Register: React.FC = () => {
  const { register: authRegister, loading } = useAuth()
  const navigate = useNavigate()

  const form = useForm({
    defaultValues: {
      nombre: '',
      apellido: '',
      email: '',
      password: '',
      telefono: '',
      direccion: '',
    },
    onSubmit: async ({ value }) => {
      // Validar con Zod antes de enviar
      const result = registerSchema.safeParse(value)
      if (!result.success) {
        const firstError = result.error.issues[0]
        showToast.error(firstError.message)
        return
      }

      try {
        await authRegister(value)
        showToast.success('¡Registro exitoso! Bienvenido a ZIGO')
        navigate('/products')
      } catch (err) {
        const errorMessage = (err as Error).message || 'Error al registrarse'
        showToast.error(errorMessage)
        console.error('Registration failed:', err)
      }
    },
  })

  return (
    <Container component="main" maxWidth="sm" className="min-h-screen flex items-center justify-center bg-gray-50">
      <Box className="w-full p-8 space-y-6 bg-white rounded-lg shadow-md">
        <Typography component="h1" variant="h5" className="text-center text-zigo-dark-text">
          Registrarse
        </Typography>
        
        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
          className="space-y-4"
        >
          {/* Campo Nombre */}
          <form.Field
            name="nombre"
            validators={{
              onChange: ({ value }) => {
                const result = registerSchema.shape.nombre.safeParse(value)
                return result.success ? undefined : result.error.issues[0]?.message
              },
            }}
            children={(field) => (
              <TextField
                id="nombre"
                name={field.name}
                label="Nombre"
                variant="outlined"
                fullWidth
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
                  'aria-label': 'Nombre',
                  'aria-required': 'true',
                  'aria-invalid': field.state.meta.isTouched && !!field.state.meta.errors.length,
                }}
              />
            )}
          />

          {/* Campo Apellido */}
          <form.Field
            name="apellido"
            validators={{
              onChange: ({ value }) => {
                const result = registerSchema.shape.apellido.safeParse(value)
                return result.success ? undefined : result.error.issues[0]?.message
              },
            }}
            children={(field) => (
              <TextField
                id="apellido"
                name={field.name}
                label="Apellido"
                variant="outlined"
                fullWidth
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
                  'aria-label': 'Apellido',
                  'aria-required': 'true',
                  'aria-invalid': field.state.meta.isTouched && !!field.state.meta.errors.length,
                }}
              />
            )}
          />

          {/* Campo Email */}
          <form.Field
            name="email"
            validators={{
              onChange: ({ value }) => {
                const result = registerSchema.shape.email.safeParse(value)
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
                }}
              />
            )}
          />

          {/* Campo Password */}
          <form.Field
            name="password"
            validators={{
              onChange: ({ value }) => {
                const result = registerSchema.shape.password.safeParse(value)
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
                autoComplete="new-password"
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
                }}
              />
            )}
          />

          {/* Campo Teléfono */}
          <form.Field
            name="telefono"
            validators={{
              onChange: ({ value }) => {
                const result = registerSchema.shape.telefono.safeParse(value)
                return result.success ? undefined : result.error.issues[0]?.message
              },
            }}
            children={(field) => (
              <TextField
                id="telefono"
                name={field.name}
                label="Teléfono"
                variant="outlined"
                fullWidth
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
                  'aria-label': 'Teléfono',
                  'aria-required': 'true',
                  'aria-invalid': field.state.meta.isTouched && !!field.state.meta.errors.length,
                }}
              />
            )}
          />

          {/* Campo Dirección */}
          <form.Field
            name="direccion"
            validators={{
              onChange: ({ value }) => {
                const result = registerSchema.shape.direccion.safeParse(value)
                return result.success ? undefined : result.error.issues[0]?.message
              },
            }}
            children={(field) => (
              <TextField
                id="direccion"
                name={field.name}
                label="Dirección"
                variant="outlined"
                fullWidth
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
                  'aria-label': 'Dirección',
                  'aria-required': 'true',
                  'aria-invalid': field.state.meta.isTouched && !!field.state.meta.errors.length,
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
                aria-label="Registrarse"
              >
                {isSubmitting || loading ? 'Cargando...' : 'Registrarse'}
              </Button>
            )}
          />
        </form>

        <Typography variant="body2" className="text-center text-gray-600">
          ¿Ya tienes cuenta? <a href="/login" className="text-primary-500 hover:underline">Inicia Sesión</a>
        </Typography>
      </Box>
    </Container>
  )
}

export default Register