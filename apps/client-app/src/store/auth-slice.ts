import { createSlice } from '@reduxjs/toolkit'

export interface AuthState {
  isAuthenticated: boolean
}

const initialState: AuthState = {
  isAuthenticated: false,
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signInAction: (state) => {
      state.isAuthenticated = true
    },
    signOutAction: (state) => {
      state.isAuthenticated = false
    },
  },
})

export const { signInAction, signOutAction } = authSlice.actions
export default authSlice.reducer
