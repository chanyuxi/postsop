import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

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
    signInAction: (state, action: PayloadAction<User>) => {
      state.user = action.payload
    },
    signOutAction: (state) => {
      state.user = null
    },

    /** Temporary function to initialize the user */
    temporary_initializeUser: (state) => {
      state.user = {
        id: 1,
        email: 'hello@example.com',
        roles: [{ name: 'member' }],
      }
    },
  },
})

export const { signInAction, signOutAction, temporary_initializeUser } =
  authSlice.actions
export default authSlice.reducer
