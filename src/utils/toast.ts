import toast, { Toaster } from 'react-hot-toast'

// Configuración de estilos personalizados
const toastStyles = {
  success: {
    duration: 3000,
    style: {
      background: '#10B981',
      color: '#fff',
      fontWeight: '500',
      padding: '16px',
      borderRadius: '8px',
    },
    iconTheme: {
      primary: '#fff',
      secondary: '#10B981',
    },
  },
  error: {
    duration: 4000,
    style: {
      background: '#EF4444',
      color: '#fff',
      fontWeight: '500',
      padding: '16px',
      borderRadius: '8px',
    },
    iconTheme: {
      primary: '#fff',
      secondary: '#EF4444',
    },
  },
  loading: {
    style: {
      background: '#3B82F6',
      color: '#fff',
      fontWeight: '500',
      padding: '16px',
      borderRadius: '8px',
    },
    iconTheme: {
      primary: '#fff',
      secondary: '#3B82F6',
    },
  },
  info: {
    duration: 3000,
    style: {
      background: '#3B82F6',
      color: '#fff',
      fontWeight: '500',
      padding: '16px',
      borderRadius: '8px',
    },
    iconTheme: {
      primary: '#fff',
      secondary: '#3B82F6',
    },
  },
  warning: {
    duration: 3500,
    style: {
      background: '#F59E0B',
      color: '#fff',
      fontWeight: '500',
      padding: '16px',
      borderRadius: '8px',
    },
    iconTheme: {
      primary: '#fff',
      secondary: '#F59E0B',
    },
  },
}

// Funciones de toast estandarizadas
export const showToast = {
  success: (message: string) => {
    toast.success(message, toastStyles.success)
  },
  
  error: (message: string) => {
    toast.error(message, toastStyles.error)
  },
  
  loading: (message: string) => {
    return toast.loading(message, toastStyles.loading)
  },
  
  info: (message: string) => {
    toast(message, { ...toastStyles.info, icon: 'ℹ️' })
  },
  
  warning: (message: string) => {
    toast(message, { ...toastStyles.warning, icon: '⚠️' })
  },
  
  // Para actualizar un toast de loading a success o error
  promise: <T,>(
    promise: Promise<T>,
    messages: {
      loading: string
      success: string
      error: string
    }
  ) => {
    return toast.promise(
      promise,
      {
        loading: messages.loading,
        success: messages.success,
        error: messages.error,
      },
      {
        success: toastStyles.success,
        error: toastStyles.error,
        loading: toastStyles.loading,
      }
    )
  },
}

// Exportar el componente Toaster para usarlo en App
export { Toaster }

export default showToast
