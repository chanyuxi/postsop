import { configureStore } from '@reduxjs/toolkit'

import authSlice from './authSlice'
import systemSlice from './systemSlice'

export const store = configureStore({
  reducer: {
    auth: authSlice,
    system: systemSlice,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
