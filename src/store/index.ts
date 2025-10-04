import { configureStore } from '@reduxjs/toolkit'
import authSlice from './slices/authSlice'
import cartSlice from './slices/cartSlice'

// Configuración del store de Redux
export const store = configureStore({
  reducer: {
    auth: authSlice,
    cart: cartSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
