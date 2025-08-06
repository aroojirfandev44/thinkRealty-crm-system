import { combineReducers } from '@reduxjs/toolkit'
import landingPageReducer from './Reducer/landingPageSlice'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage

const rootReducer = combineReducers({
  landingPage: landingPageReducer,
})

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['landingPage'], // only persist landingPage slice
}

export const persistedReducer = persistReducer(persistConfig, rootReducer)

export type RootReducerType = ReturnType<typeof rootReducer>
