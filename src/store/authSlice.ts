import { createSlice } from '@reduxjs/toolkit'

import { type User } from '@/types/system'

export interface AuthState {
  user: User | null
}

const initialState: AuthState = {
  user: null,
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signInAction: (state) => {
      state.user = {
        id: 1,
        name: 'John Doe',
        signature: 'Dreams always dreams without actions',
      }
    },
    signOutAction: (state) => {
      state.user = null
    },

    unstable_initializeUser: (state) => {
      state.user = {
        id: 1,
        name: 'John Doe',
        signature: 'Dreams always dreams without actions',
      }
    },
  },
})

export const { signInAction, signOutAction, unstable_initializeUser } =
  authSlice.actions
export default authSlice.reducer
