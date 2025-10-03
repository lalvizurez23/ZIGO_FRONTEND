# ZIGO Frontend

Frontend de la aplicación ZIGO desarrollado con React, Vite, Tailwind CSS y Material UI.

## 🚀 Inicio Rápido

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

## 🔧 Configuración

### Tecnologías Utilizadas
- **React 18.3.1** - Biblioteca de UI
- **Vite 4.5.3** - Herramienta de build y desarrollo
- **Tailwind CSS** - Framework de estilos
- **Material UI Icons** - Iconografía
- **TanStack Query** - Manejo de estado y fetching de datos
- **React Router** - Navegación
- **React Hook Form** - Manejo de formularios
- **Axios** - Cliente HTTP

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
│   ├── components/          # Componentes reutilizables
│   │   ├── Layout.jsx       # Layout principal con navegación
│   │   └── ProtectedRoute.jsx # Protección de rutas
│   ├── contexts/            # Contextos de React
│   │   └── AuthContext.jsx  # Contexto de autenticación
│   ├── hooks/               # Custom hooks
│   ├── pages/               # Páginas de la aplicación
│   │   ├── Login.jsx        # Página de login
│   │   ├── Register.jsx     # Página de registro
│   │   ├── Products.jsx     # Listado de productos
│   │   ├── Cart.jsx         # Carrito de compras
│   │   ├── Checkout.jsx     # Proceso de compra
│   │   └── Orders.jsx       # Historial de pedidos
│   ├── services/            # Servicios de API
│   │   ├── api.js           # Configuración de Axios
│   │   ├── authService.js   # Servicios de autenticación
│   │   ├── productService.js # Servicios de productos
│   │   ├── cartService.js   # Servicios de carrito
│   │   └── orderService.js  # Servicios de pedidos
│   ├── types/               # Definiciones de tipos
│   ├── utils/               # Utilidades
│   ├── constants/           # Constantes
│   ├── App.jsx              # Componente principal
│   ├── main.jsx             # Punto de entrada
│   └── index.css            # Estilos globales con Tailwind
├── tailwind.config.js       # Configuración de Tailwind
├── postcss.config.js        # Configuración de PostCSS
├── package.json
├── vite.config.js
└── README.md
```

## 🌐 Backend

Este frontend se conecta con el backend ZIGO que corre en:
- **URL Base**: `http://localhost:3000`
- **API Endpoints**: Ver documentación del backend
- **Autenticación**: JWT con refresh automático

## 🛠️ Desarrollo

### Comandos Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run preview` - Previsualiza el build de producción
- `npm run lint` - Ejecuta ESLint para verificar el código

### Características Implementadas

✅ **Autenticación Completa**
- Login y registro de usuarios
- Protección de rutas
- Manejo de tokens JWT
- Logout automático

✅ **Gestión de Estado**
- TanStack Query para fetching de datos
- Context API para autenticación
- Estados de loading/error/success

✅ **UI/UX Moderna**
- Tailwind CSS para estilos
- Material UI Icons
- Diseño responsive
- Componentes reutilizables

✅ **Estructura Organizada**
- File system consistente
- Separación de responsabilidades
- Servicios modulares
- Hooks personalizados

### Páginas Implementadas

- **Login** - Autenticación de usuarios
- **Register** - Registro de nuevos usuarios
- **Products** - Listado y búsqueda de productos
- **Cart** - Carrito de compras (placeholder)
- **Checkout** - Proceso de compra (placeholder)
- **Orders** - Historial de pedidos (placeholder)

## 🚀 Próximos Pasos

1. Implementar funcionalidad completa del carrito
2. Desarrollar proceso de checkout
3. Crear historial de pedidos
4. Añadir filtros y categorías
5. Implementar paginación
6. Añadir tests unitarios

## 📝 Notas

- Compatible con Node.js 20.10.0+
- Usa Vite 4.5.3 para compatibilidad
- Material UI Icons sin conflicto con Tailwind
- Configuración optimizada para desarrollo