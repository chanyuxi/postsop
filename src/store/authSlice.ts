import { createSlice } from '@reduxjs/toolkit'

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
  },
})

export const { signInAction, signOutAction } = authSlice.actions
export default authSlice.reducer
