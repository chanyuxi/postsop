import { configureStore } from '@reduxjs/toolkit'

import authSlice from './auth-slice'
import systemSlice from './system-slice'

export const store = configureStore({
  reducer: {
    auth: authSlice,
    system: systemSlice,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
