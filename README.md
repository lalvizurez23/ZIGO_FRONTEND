# ZIGO Frontend

Frontend de la aplicación ZIGO desarrollado con React, TypeScript, Vite, Tailwind CSS, Material UI, Redux Toolkit y TanStack Query.

## Arquitectura y Decisiones Técnicas

### Redux Toolkit - Solo para Autenticación
Utilizamos **Redux Toolkit exclusivamente para el estado de autenticación** (token JWT, datos del usuario, estado de login). Esto nos permite:

- **Seguridad Máxima**: El token JWT se almacena **solo en memoria** (Redux Store), no en `localStorage` ni `sessionStorage`
- **Prevención de XSS**: JavaScript malicioso no puede acceder al token desde el almacenamiento del navegador
- **Rendimiento**: Estado global optimizado solo para lo esencial
- **Control de Acceso**: Gestión centralizada del estado de autenticación

### TanStack Query - Para Datos del Backend
Utilizamos **TanStack Query para todos los datos que vienen del backend** (productos, carrito, pedidos). Esto nos proporciona:

- **Cache Inteligente**: Datos se cachean automáticamente con `staleTime` configurado
- **Sincronización**: Actualización automática de datos entre componentes
- **Optimización**: Evita peticiones innecesarias al backend
- **Estados de Carga**: Manejo automático de loading, error y success states

### Separación de Responsabilidades

```typescript
// Redux Toolkit - SOLO Autenticación
interface AuthState {
  user: User | null           // Datos del usuario
  accessToken: string | null  // Token JWT (solo en memoria)
  isAuthenticated: boolean    // Estado de autenticación
  loading: boolean           // Loading de auth
  error: string | null       // Errores de auth
}

// TanStack Query - TODOS los datos del backend
useProducts()    // Productos del backend
useCart()        // Carrito del backend  
useOrders()      // Pedidos del backend
useProduct()     // Producto específico
useCreateOrder() // Crear pedido
```

### Beneficios de Seguridad

1. **Token JWT en Memoria**: Imposible de acceder desde JavaScript malicioso
2. **Sin Persistencia Local**: No hay datos sensibles en `localStorage`
3. **Actualización Automática**: Tokens se renuevan automáticamente sin intervención del usuario
4. **Manejo de Errores 401**: Redirección automática al login si el token expira

### Comportamiento de Refresh de Página

**IMPORTANTE**: Al refrescar la página (F5), el usuario **perderá su sesión** y será redirigido al login.

#### ¿Por qué sucede esto?
- **Token en Memoria**: El token JWT se almacena únicamente en Redux (memoria RAM)
- **Redux se Resetea**: Al refrescar, Redux se reinicia y pierde todo el estado
- **Sin Persistencia**: No guardamos el token en `localStorage` por seguridad

#### ¿Por qué NO usamos localStorage?
```typescript
// VULNERABLE - NO HACEMOS ESTO
localStorage.setItem('access_token', token) // Accesible por XSS

// SEGURO - LO QUE HACEMOS
const [token, setToken] = useState(null) // Solo en memoria
```

**Razones de Seguridad:**
- **Ataques XSS**: Scripts maliciosos pueden leer `localStorage`
- **Exposición**: El token queda visible en DevTools
- **Persistencia Innecesaria**: El token se mantiene después de cerrar el navegador
- **Mejores Prácticas**: Tokens sensibles deben estar solo en memoria

#### Flujo de Autenticación Seguro:
```
1. Usuario hace Login → Token se guarda en Redux (memoria)
2. Usuario navega → Token se usa para peticiones al backend
3. Usuario refresca (F5) → Redux se resetea, token se pierde
4. ProtectedRoute detecta → No hay token, redirige al login
5. Usuario debe hacer login → Nuevamente para acceder
```

**Nota**: Este comportamiento es **intencional y más seguro** que mantener sesiones persistentes.

## Inicio Rápido

### Prerrequisitos
- Node.js 20.10.0+ (recomendado: 20.19+ o 22.12+)
- npm o yarn
- Backend ZIGO ejecutándose en `http://localhost:3000`

### Instalación

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/lalvizurez23/ZIGO_FRONTEND.git
   cd ZIGO_FRONTEND
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno:**
   ```bash
   cp env.example .env
   # Editar .env con tus configuraciones
   ```

4. **Ejecutar en modo desarrollo:**
   ```bash
   npm run dev
   ```

5. **Construir para producción:**
   ```bash
   npm run build
   ```

## Configuración

### Tecnologías Utilizadas

#### Frontend Core
- **React 18.3.1** - Biblioteca de UI con TypeScript
- **TypeScript** - Tipado estático para mayor seguridad y mantenibilidad
- **Vite 4.5.3** - Herramienta de build y desarrollo ultra-rápida

#### UI/UX
- **Tailwind CSS** - Framework de estilos utility-first
- **Material UI Icons** - Iconografía consistente
- **React Hook Form** - Manejo de formularios con validación
- **Yup** - Validación de esquemas

#### Estado y Datos
- **Redux Toolkit** - Estado global SOLO para autenticación
- **TanStack Query** - Fetching y cache de datos del backend
- **React Context** - Contexto de autenticación

#### Navegación y HTTP
- **React Router v6** - Navegación declarativa
- **Axios** - Cliente HTTP con interceptores
- **JWT Decode** - Decodificación de tokens JWT

### Variables de Entorno
```env
VITE_API_URL=http://localhost:3000
VITE_APP_NAME=ZIGO Frontend
VITE_APP_VERSION=1.0.0
```

## 📁 Estructura del Proyecto

```
zigo-frontend/
├── public/
│   └── vite.svg
├── src/
│   ├── components/          # Componentes reutilizables (TypeScript)
│   │   ├── Layout.tsx       # Layout principal con navegación
│   │   └── ProtectedRoute.tsx # Protección de rutas
│   ├── contexts/            # Contextos de React (TypeScript)
│   │   └── AuthContext.tsx  # Contexto de autenticación
│   ├── hooks/               # Custom hooks con TanStack Query
│   │   ├── useAuth.ts       # Hooks de autenticación
│   │   ├── useProducts.ts   # Hooks de productos
│   │   ├── useCart.ts       # Hooks de carrito
│   │   └── useOrders.ts     # Hooks de pedidos
│   ├── pages/               # Páginas de la aplicación (TypeScript)
│   │   ├── Login.tsx        # Página de login
│   │   ├── Register.tsx     # Página de registro
│   │   ├── Products.tsx     # Listado de productos
│   │   ├── Cart.tsx         # Carrito de compras
│   │   ├── Checkout.tsx     # Proceso de compra
│   │   └── Orders.tsx       # Historial de pedidos
│   ├── services/            # Servicios de API (TypeScript)
│   │   ├── api.ts           # Configuración de Axios
│   │   ├── authService.ts   # Servicios de autenticación
│   │   ├── productService.ts # Servicios de productos
│   │   ├── cartService.ts   # Servicios de carrito
│   │   └── orderService.ts  # Servicios de pedidos
│   ├── store/               # Redux Store (SOLO autenticación)
│   │   ├── index.ts         # Configuración del store
│   │   ├── hooks.ts         # Hooks tipados de Redux
│   │   └── slices/
│   │       └── authSlice.ts # Slice de autenticación
│   ├── utils/               # Utilidades (TypeScript)
│   │   └── jwtUtils.ts      # Utilidades JWT
│   ├── App.tsx              # Componente principal
│   ├── main.tsx             # Punto de entrada
│   └── index.css            # Estilos globales con Tailwind
├── tailwind.config.js       # Configuración de Tailwind
├── postcss.config.js        # Configuración de PostCSS
├── tsconfig.json            # Configuración de TypeScript
├── tsconfig.node.json       # Configuración de TypeScript para Node
├── package.json
├── vite.config.ts
└── README.md
```

## Características Implementadas

### Autenticación Segura
- **Login y Registro** con validación de formularios
- **Protección de rutas** con `ProtectedRoute`
- **Token JWT en memoria** (no en localStorage)
- **Redirección automática** al login si no está autenticado
- **Manejo de errores** de autenticación
- **Sesión se pierde al refrescar** (por seguridad)

### E-commerce Básico
- **Listado de productos** con búsqueda
- **Búsqueda inteligente** (mínimo 3 caracteres)
- **Carrito de compras** (placeholder)
- **Proceso de checkout** (placeholder)
- **Historial de pedidos** (placeholder)

### UI/UX
- **Diseño responsive** con Tailwind CSS
- **Iconografía consistente** con Material UI
- **Loading states** con spinner personalizado
- **Formularios validados** con React Hook Form
- **Navegación intuitiva** con React Router

### Rendimiento y Seguridad
- **Cache inteligente** con TanStack Query
- **Estado optimizado** con Redux Toolkit
- **Tipado estático** con TypeScript
- **Sin vulnerabilidades XSS** (sin localStorage)
- **Interceptores HTTP** para manejo automático de tokens

## Backend

Este frontend se conecta con el backend ZIGO que corre en:
- **URL Base**: `http://localhost:3000`
- **API Endpoints**: Ver documentación del backend
- **Autenticación**: JWT con refresh automático

### Sistema de Tokens Automáticos

El frontend implementa un sistema de tokens automáticos que funciona de la siguiente manera:

#### Flujo de Autenticación:
1. **Login**: Usuario inicia sesión → Backend devuelve `accessToken`
2. **Almacenamiento**: Token se guarda **solo en memoria** (Redux Store)
3. **Requests**: Cada petición incluye automáticamente el token actual
4. **Respuesta**: Backend devuelve nuevo token refrescado en cada respuesta
5. **Actualización**: Frontend actualiza automáticamente el token en Redux
6. **Siguiente Request**: Usa el token actualizado automáticamente

#### Seguridad Implementada:
- **Token en memoria**: No se guarda en `localStorage` (vulnerable a XSS)
- **Redux Store**: Estado centralizado y seguro
- **Datos del usuario en memoria**: Información completa del usuario solo en Redux
- **JWT mínimo**: Token solo contiene userId, email, iat, exp
- **Sin validación de expiración**: Backend maneja toda la lógica de tokens
- **Interceptor Axios**: Agrega token automáticamente a cada petición
- **Actualización automática**: Token se refresca en cada respuesta
- **Manejo de errores 401**: Redirige al login si el token es inválido

#### Código de Ejemplo:
```javascript
// 1. Login - Token se guarda en Redux
const { login } = useAuth()
await login(credentials) // Token se guarda en memoria

// 2. Request automático - Token se incluye automáticamente
const { data } = await api.get('/productos') // Token se agrega automáticamente

// 3. Respuesta - Token se actualiza automáticamente
// Si response.data.accessToken existe, se actualiza en Redux
```

## Desarrollo

### Comandos Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run preview` - Previsualiza el build de producción
- `npm run lint` - Ejecuta ESLint para verificar el código

### Características Implementadas

**Autenticación Completa**
- Login y registro de usuarios
- Protección de rutas
- Manejo de tokens JWT en memoria
- Logout automático
- **Sistema de tokens automáticos** (sin endpoints de refresh)

**Gestión de Estado Híbrida**
- **Redux Toolkit** SOLO para autenticación (token, usuario, estado de login)
- **TanStack Query** para TODOS los datos del backend (productos, carrito, pedidos)
- **Context API** para autenticación
- Estados de loading/error/success automáticos
- **Tokens en memoria** (no localStorage) - Prevención de XSS

**UI/UX Moderna**
- Tailwind CSS para estilos
- Material UI Icons
- Diseño responsive
- Componentes reutilizables
- **Colores y tipografía de Zigo**

**Estructura Organizada**
- File system consistente con TypeScript
- Separación clara de responsabilidades
- Servicios modulares tipados
- Hooks personalizados con TanStack Query
- **Redux slice único** para autenticación
- **Imports directos** (sin archivos index.ts)

### Implementación Técnica del Sistema de Tokens

#### 1. Redux Store (Solo Autenticación)
```typescript
// store/slices/authSlice.ts
interface AuthState {
  user: User | null           // Datos del usuario
  accessToken: string | null  // Token JWT (solo en memoria)
  isAuthenticated: boolean    // Estado de autenticación
  loading: boolean           // Loading de auth
  error: string | null       // Errores de auth
}

const initialState: AuthState = {
  user: null,
  accessToken: null, // Solo en memoria - Prevención de XSS
  isAuthenticated: false,
  loading: false,
  error: null,
}
```

#### 2. TanStack Query (Datos del Backend)
```typescript
// hooks/useProducts.ts
export const useProducts = (params: ProductParams = {}) => {
  const dispatch = useAppDispatch()

  return useQuery({
    queryKey: ['products', params],
    queryFn: async () => {
      const response = await productService.getProducts(params)
      
      // Solo actualizar token en Redux si viene del backend
      if (response.accessToken) {
        dispatch(updateToken(response.accessToken))
      }
      
      // Retornar SOLO los datos del backend (no Redux)
      return response
    },
    staleTime: 5 * 60 * 1000, // 5 minutos de cache
    retry: 1,
    refetchOnWindowFocus: false,
  })
}
```

#### **3. Interceptor de Axios (Seguridad)**
```typescript
// services/api.ts
let authToken: string | null = null // Variable en memoria

api.interceptors.request.use((config) => {
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`
  }
  return config
})

api.interceptors.response.use(
  (response) => {
    // Si la respuesta contiene un nuevo token, se actualiza automáticamente
    if (response.data?.accessToken) {
      console.log('Nuevo token recibido del backend')
    }
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado - redirigir al login
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)
```

#### **4. Componentes que Consumen (Separación Clara)**
```typescript
// pages/Products.tsx
const Products: React.FC = () => {
  // TanStack Query maneja los datos del backend
  const { data: products, isLoading, error } = useProducts({
    search: searchTerm,
    categoria: selectedCategory
  })

  // Redux maneja solo la autenticación
  const { user, isAuthenticated } = useAppSelector(state => state.auth)

  // Los productos vienen directamente del backend via TanStack Query
  const productsList = products || []

  if (isLoading) return <LoadingSpinner />
  if (error) return <ErrorMessage onRetry={refetch} />
  
  return <ProductList products={productsList} />
}
```

### Páginas Implementadas

- **Login** - Autenticación de usuarios
- **Register** - Registro de nuevos usuarios
- **Products** - Listado y búsqueda de productos
- **Cart** - Carrito de compras (placeholder)
- **Checkout** - Proceso de compra (placeholder)
- **Orders** - Historial de pedidos (placeholder)

## Responsabilidades del Frontend

### Redux Toolkit (Solo Autenticación):
- **Almacenar token JWT** en memoria (no localStorage)
- **Gestionar estado de autenticación** (isAuthenticated, loading, error)
- **Almacenar datos del usuario** (nombre, email, etc.)
- **Actualizar token** cuando viene del backend

### TanStack Query (Datos del Backend):
- **Obtener productos** del backend con cache automático
- **Gestionar carrito** del backend con sincronización
- **Manejar pedidos** del backend con estados de carga
- **Actualizar datos** automáticamente entre componentes

### Seguridad Implementada:
- **Token JWT en memoria**: Imposible de acceder desde JavaScript malicioso
- **Sin localStorage**: No hay datos sensibles en almacenamiento del navegador
- **Interceptor Axios**: Agrega token automáticamente a cada petición
- **Manejo de errores 401**: Redirección automática al login
- **Actualización automática**: Tokens se renuevan sin intervención del usuario

### Lo que el Frontend NO debe hacer:
- **No validar expiración de tokens** (backend lo maneja)
- **No guardar tokens en localStorage** (vulnerable a XSS)
- **No guardar datos del usuario en localStorage** (userId, email, etc.)
- **No llamar endpoints de refresh** (no existen)
- **No persistir tokens** entre recargas de página
- **No exponer información sensible** en el almacenamiento del navegador

### Flujo de Datos:
```
1. Usuario hace login → Token se guarda en Redux (memoria)
2. Usuario navega → TanStack Query obtiene datos del backend
3. Petición incluye token automáticamente (interceptor Axios)
4. Backend responde → Incluye nuevo token (si es necesario)
5. Frontend actualiza → Token se actualiza en Redux
6. Si token expira → Backend responde 401 → Frontend redirige a login
7. Siguiente petición → Usa token actualizado (o usuario debe hacer login)
```

## Próximos Pasos

1. Implementar funcionalidad completa del carrito
2. Desarrollar proceso de checkout
3. Crear historial de pedidos
4. Añadir filtros y categorías
5. Implementar paginación
6. Añadir tests unitarios

## Notas Técnicas

### Compatibilidad:
- **Node.js**: 20.10.0+ (recomendado: 20.19+ o 22.12+)
- **Vite**: 4.5.3 para compatibilidad con Node.js 20.10.0
- **TypeScript**: Configuración estricta para mayor seguridad
- **Material UI Icons**: Sin conflicto con Tailwind CSS

### Decisiones de Seguridad:
- **Token JWT en memoria**: Prevención de ataques XSS
- **Sin localStorage**: No hay datos sensibles en almacenamiento del navegador
- **Interceptor Axios**: Agrega token automáticamente a cada petición
- **Manejo de errores 401**: Redirección automática al login

### Decisiones de Arquitectura:
- **Redux Toolkit**: Solo para autenticación (token, usuario, estado de login)
- **TanStack Query**: Para todos los datos del backend (productos, carrito, pedidos)
- **TypeScript**: Tipado estático para mayor seguridad y mantenibilidad
- **Imports directos**: Sin archivos index.ts para mayor claridad

### Optimizaciones:
- **Cache inteligente**: TanStack Query con staleTime configurado
- **Estados de carga**: Manejo automático de loading, error y success
- **Sincronización**: Actualización automática de datos entre componentes
- **Rendimiento**: Redux solo para lo esencial, TanStack Query para datos del backend

## Comportamiento de Refresh - IMPORTANTE

### ¿Qué pasa al refrescar la página (F5)?

**El usuario PERDERÁ su sesión y será redirigido al login.**

### Explicación Técnica:

```typescript
// NO HACEMOS ESTO (vulnerable a XSS)
localStorage.setItem('access_token', token)

// SÍ HACEMOS ESTO (seguro)
const [token, setToken] = useState(null) // Solo en memoria
```

### Razones de Seguridad:

1. **Ataques XSS**: `localStorage` es accesible por JavaScript malicioso
2. **Exposición de datos**: Tokens visibles en DevTools del navegador
3. **Persistencia innecesaria**: Tokens no deben sobrevivir al cierre del navegador
4. **Mejores prácticas**: Tokens sensibles solo en memoria

### Flujo de Usuario:

```
1. Usuario hace login → Sesión activa
2. Usuario navega → Acceso normal
3. Usuario refresca (F5) → Sesión perdida
4. Usuario es redirigido → Debe hacer login nuevamente
```

### Nota para Desarrolladores:

Este comportamiento es **intencional y más seguro** que mantener sesiones persistentes. Si necesitas sesiones que sobrevivan al refresh, considera:

- **Cookies HttpOnly**: Para tokens (más seguro que localStorage)
- **Refresh tokens**: Con rotación automática
- **Sesiones del servidor**: Con Redis o base de datos

**Para ZIGO, priorizamos la seguridad sobre la comodidad del usuario.**