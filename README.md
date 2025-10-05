# ZIGO Frontend - E-commerce

Frontend de la aplicación ZIGO desarrollado con React, TypeScript, Vite, Tailwind CSS, Material UI, Redux Toolkit y TanStack Query.

## Requisitos Previos

- Node.js >= 20.10.0
- npm o yarn
- Backend ZIGO ejecutándose en `http://localhost:3000`

## Instalación

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar variables de entorno
```bash
cp env.example .env
```

Edita el archivo `.env`:
```env
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME=ZIGO Frontend
VITE_APP_VERSION=1.0.0
```

### 3. Ejecutar en modo desarrollo
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

### 4. Construir para producción
```bash
npm run build
```

## Arquitectura del Sistema

### Gestión de Estado Híbrida

El proyecto implementa una arquitectura de estado híbrida que separa responsabilidades:

#### Redux Toolkit - Solo Autenticación
```typescript
interface AuthState {
  user: User | null           // Datos del usuario
  accessToken: string | null  // Token JWT (solo en memoria)
  isAuthenticated: boolean    // Estado de autenticación
  loading: boolean
  error: string | null
}
```

**Responsabilidades:**
- Almacenar token JWT en memoria (NO en localStorage)
- Gestionar estado de autenticación
- Almacenar datos del usuario
- Actualizar token cuando viene del backend

#### TanStack Query - Datos del Backend
```typescript
useProducts()    // Productos del backend
useCart()        // Carrito del backend  
useOrders()      // Pedidos del backend
useCheckout()    // Proceso de pago
```

**Responsabilidades:**
- Cache inteligente de datos
- Sincronización automática entre componentes
- Manejo de estados de carga (loading, error, success)
- Invalidación y refetch automático

### Arquitectura de Carrito Persistente

El sistema implementa un carrito persistente único por usuario:

**Flujo de Carrito:**
1. Usuario se registra → Backend crea carrito automáticamente
2. Usuario agrega productos → Se agregan al carrito persistente
3. Usuario realiza checkout → Se crea pedido y se vacía el carrito
4. Nueva compra → Reutiliza el mismo carrito (vacío)

**Características:**
- Un solo carrito activo por usuario
- Persistente entre sesiones (en el backend)
- Se vacía después de cada compra (no se elimina)
- ID del carrito se obtiene del backend (no se envía desde frontend)

### Sistema de Autenticación

**Seguridad Implementada:**
- Token JWT almacenado SOLO en memoria (Redux)
- NO se usa localStorage (prevención de XSS)
- Extracción de userId del token JWT en el backend
- Renovación automática de tokens
- Redirección automática al login si el token expira
- Blacklist de tokens en Redis

**Flujo de Autenticación:**
```
1. Login → Token se guarda en Redux (memoria)
2. Request → Token se incluye automáticamente (interceptor)
3. Backend valida → Extrae userId del token
4. Respuesta → Datos + nuevo token (si es necesario)
5. Frontend actualiza → Token se actualiza en Redux
6. Token expira → Backend responde 401 → Redirección al login
```

### Notificaciones Toast

Sistema estandarizado de notificaciones con `react-hot-toast`:

**Tipos de notificaciones:**
- Success (verde) - Operaciones exitosas
- Error (rojo) - Errores
- Warning (naranja) - Advertencias
- Info (azul) - Información
- Loading (azul) - Cargando

**Implementadas en:**
- Login/Registro exitoso
- Productos agregados al carrito
- Cantidades actualizadas
- Productos eliminados
- Pedidos procesados
- Sesión expirada
- Errores de API

## Estructura del Proyecto

```
zigo-frontend/
├── public/
│   └── vite.svg
├── src/
│   ├── components/              # Componentes reutilizables
│   │   ├── Layout.tsx           # Layout con navegación
│   │   ├── ProtectedRoute.tsx   # Protección de rutas
│   │   └── LoadingSpinner.tsx   # Spinner de carga
│   ├── contexts/                # Contextos de React
│   │   └── AuthContext.tsx      # Contexto de autenticación
│   ├── hooks/                   # Custom hooks con TanStack Query
│   │   ├── useAuth.ts           # Hooks de autenticación
│   │   ├── useProducts.ts       # Hooks de productos
│   │   ├── useCart.ts           # Hooks de carrito
│   │   ├── useOrders.ts         # Hooks de pedidos
│   │   └── useCheckout.ts       # Hook de checkout
│   ├── pages/                   # Páginas de la aplicación
│   │   ├── Login.tsx            # Página de login
│   │   ├── Register.tsx         # Página de registro
│   │   ├── Products.tsx         # Listado de productos
│   │   ├── Cart.tsx             # Carrito de compras
│   │   ├── Checkout.tsx         # Proceso de compra
│   │   └── Orders.tsx           # Historial de pedidos
│   ├── services/                # Servicios de API
│   │   ├── api.ts               # Configuración de Axios
│   │   ├── authService.ts       # Servicios de autenticación
│   │   ├── productService.ts    # Servicios de productos
│   │   ├── cartService.ts       # Servicios de carrito
│   │   ├── orderService.ts      # Servicios de pedidos
│   │   └── checkoutService.ts   # Servicio de checkout
│   ├── store/                   # Redux Store
│   │   ├── index.ts             # Configuración del store
│   │   ├── hooks.ts             # Hooks tipados de Redux
│   │   └── slices/
│   │       ├── authSlice.ts     # Slice de autenticación
│   │       └── cartSlice.ts     # Slice de carrito (solo ID)
│   ├── types/                   # Tipos TypeScript
│   │   └── index.ts             # Tipos compartidos
│   ├── utils/                   # Utilidades
│   │   ├── jwtUtils.ts          # Utilidades JWT
│   │   └── toast.ts             # Utilidades de notificaciones
│   ├── App.tsx                  # Componente principal
│   ├── main.tsx                 # Punto de entrada
│   └── index.css                # Estilos globales
├── tailwind.config.js           # Configuración de Tailwind
├── vite.config.ts               # Configuración de Vite
└── package.json
```

## Funcionalidades Implementadas

### Autenticación
- Login con validación de formularios
- Registro de nuevos usuarios (crea carrito automáticamente)
- Protección de rutas con ProtectedRoute
- Token JWT en memoria (no en localStorage)
- Redirección automática al login si no está autenticado
- Logout con revocación de token
- Notificaciones de éxito/error

### Productos
- Listado de productos con imágenes
- Búsqueda inteligente (mínimo 3 caracteres)
- Agregar productos al carrito
- Validación de stock disponible
- Notificaciones al agregar productos
- Diseño responsive con grid

### Carrito de Compras
- Ver items del carrito
- Actualizar cantidades
- Eliminar items individuales
- Vaciar carrito completo
- Cálculo automático de totales
- Moneda en Quetzales (Q)
- Notificaciones de acciones
- Navegación a checkout

### Checkout
- Formulario con TanStack Form
- Validación en tiempo real
- Campos de dirección de envío
- Simulación de tarjeta de crédito
- Resumen del pedido
- Cálculo de total
- Procesamiento de pago
- Actualización automática de stock
- Vaciado de carrito después del pago
- Mensaje de éxito con redirección

### Historial de Pedidos
- Listado de todos los pedidos del usuario
- Detalles completos de cada pedido
- Estados con badges de colores
- Información de envío y pago
- Lista de productos por pedido
- Formato de fecha en español
- Diseño responsive

### UI/UX
- Diseño moderno con Tailwind CSS
- Iconografía con Material UI Icons
- Loading states con spinner personalizado
- Notificaciones toast animadas
- Formularios validados
- Navegación intuitiva
- Responsive design
- Moneda en Quetzales (Q)

## Tecnologías Utilizadas

### Frontend Core
- **React 18.3** - Biblioteca de UI
- **TypeScript** - Tipado estático
- **Vite 4.5** - Build tool ultra-rápido

### UI/UX
- **Tailwind CSS** - Framework de estilos
- **Material UI Icons** - Iconografía
- **React Hook Form** - Manejo de formularios
- **TanStack Form** - Formularios avanzados
- **Yup** - Validación de esquemas
- **react-hot-toast** - Notificaciones toast

### Estado y Datos
- **Redux Toolkit** - Estado global (solo auth)
- **TanStack Query** - Fetching y cache de datos
- **React Context** - Contexto de autenticación

### Navegación y HTTP
- **React Router v6** - Navegación declarativa
- **Axios** - Cliente HTTP con interceptores
- **JWT Decode** - Decodificación de tokens

## Interceptor de Axios

### Configuración de Seguridad

```typescript
// services/api.ts
let authToken: string | null = null

// Interceptor de request - Agrega token automáticamente
api.interceptors.request.use((config) => {
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`
  }
  return config
})

// Interceptor de response - Maneja token expirado
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado - limpiar y redirigir
      authToken = null
      localStorage.removeItem('token')
      store.dispatch(clearAuth())
      showToast.warning('Tu sesión ha expirado')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)
```

## Comandos Disponibles

```bash
# Desarrollo
npm run dev              # Inicia servidor de desarrollo

# Producción
npm run build            # Construye para producción
npm run preview          # Previsualiza build de producción

# Calidad de código
npm run lint             # Ejecuta ESLint
```

## Flujo de Datos

### 1. Autenticación
```
Usuario → Login → Backend valida
Backend → Token JWT + datos usuario
Frontend → Guarda en Redux (memoria)
Frontend → Redirige a /products
```

### 2. Agregar al Carrito
```
Usuario → Click "Añadir"
Frontend → GET /carrito/mi-carrito (obtiene cartId del token)
Frontend → POST /carrito/item (con cartId, productId, quantity)
Backend → Valida stock y agrega
Backend → Retorna carrito actualizado
Frontend → Invalida cache de TanStack Query
Frontend → Muestra toast de éxito
```

### 3. Checkout
```
Usuario → Llena formulario de pago
Usuario → Click "Pagar"
Frontend → POST /pedidos/checkout (con datos de envío y tarjeta)
Backend → Valida stock disponible
Backend → Crea pedido en transacción
Backend → Decrementa stock de productos
Backend → Vacía items del carrito
Backend → Retorna pedido creado
Frontend → Invalida cache (cart, orders)
Frontend → Muestra mensaje de éxito
Frontend → Redirige a /products
```

### 4. Ver Pedidos
```
Usuario → Click "Mis Pedidos"
Frontend → GET /pedidos/mis-pedidos (userId del token)
Backend → Retorna pedidos del usuario
Frontend → Cachea con TanStack Query
Frontend → Muestra historial completo
```

## Seguridad Implementada

### Prevención de XSS
- Token JWT SOLO en memoria (Redux)
- NO se usa localStorage para datos sensibles
- Interceptor Axios para manejo automático
- Limpieza de estado al expirar token

### Validaciones
- Formularios con validación en tiempo real
- Validación de stock antes de agregar
- Validación de cantidades (> 0)
- Validación de campos requeridos
- Manejo de errores de API

### Autenticación
- Token en cada request protegido
- Extracción de userId del token (backend)
- Redirección automática si no autenticado
- Blacklist de tokens en Redis (backend)

## Comportamiento de Sesión

### Al refrescar la página (F5)

**El usuario PERDERÁ su sesión y será redirigido al login.**

**Razones:**
- Token JWT almacenado SOLO en memoria (Redux)
- Redux se resetea al refrescar
- NO usamos localStorage (vulnerable a XSS)
- Prioridad: Seguridad > Comodidad

**Flujo:**
```
1. Usuario hace login → Sesión activa
2. Usuario navega → Acceso normal
3. Usuario refresca (F5) → Redux se resetea
4. ProtectedRoute detecta → No hay token
5. Usuario redirigido → Debe hacer login nuevamente
```

Este comportamiento es **intencional y más seguro** que mantener sesiones persistentes.

## Integración con Backend

### URL Base
```
http://localhost:3000/api
```

### Endpoints Consumidos

**Autenticación:**
- `POST /auth/register` - Registro (crea carrito automáticamente)
- `POST /auth/login` - Login (retorna token + usuario)
- `POST /auth/logout` - Logout (revoca token)

**Productos:**
- `GET /productos` - Listar productos (con filtros)

**Carrito:**
- `GET /carrito/mi-carrito` - Obtener carrito (userId del token)
- `POST /carrito/item` - Agregar producto
- `PUT /carrito/item/:itemId` - Actualizar cantidad
- `DELETE /carrito/item/:itemId` - Eliminar item
- `DELETE /carrito/clear` - Vaciar carrito

**Pedidos:**
- `GET /pedidos/mis-pedidos` - Historial (userId del token)
- `POST /pedidos/checkout` - Procesar pago

## Notas Técnicas

### Compatibilidad
- Node.js 20.10.0+
- Vite 4.5.3 para compatibilidad
- TypeScript con configuración estricta
- Material UI Icons sin conflicto con Tailwind

### Decisiones de Arquitectura
- Redux Toolkit SOLO para autenticación
- TanStack Query para datos del backend
- TypeScript para tipado estático
- Imports directos (sin index.ts)
- Token en memoria (no localStorage)

### Optimizaciones
- Cache inteligente con TanStack Query
- Estados de carga automáticos
- Sincronización entre componentes
- Invalidación selectiva de cache
- Notificaciones toast no intrusivas

### Moneda
- Símbolo: Q (Quetzales)
- Formato: Q1,234.56
- Precisión: 2 decimales

## Próximos Pasos

- Implementar filtros por categoría
- Agregar paginación de productos
- Implementar búsqueda avanzada
- Agregar tests unitarios
- Implementar tests E2E
- Optimizar imágenes
- Agregar PWA support

## Licencia

Proyecto de prueba técnica - ZIGO 2025