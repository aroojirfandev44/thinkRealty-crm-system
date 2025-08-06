import { configureStore } from '@reduxjs/toolkit'
import { persistedReducer } from './rootReducer'
import { persistStore } from 'redux-persist'

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false, // required for redux-persist
    }),
})

export const persistor = persistStore(store)

// 🔹 Types for TypeScript usage
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
