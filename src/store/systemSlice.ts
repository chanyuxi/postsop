import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { nanoid } from '@reduxjs/toolkit'

interface Toast {
  id: string
  message: string
}

interface SystemState {
  toasts: Toast[]
}

const initialState: SystemState = {
  toasts: [],
}

export const systemSlice = createSlice({
  name: 'system',
  initialState,
  reducers: {
    addToast: (state, action: PayloadAction<string>) => {
      state.toasts.push({
        id: nanoid(8),
        message: action.payload,
      })
    },
    removeToast: (state, action: PayloadAction<string>) => {
      state.toasts = state.toasts.filter((toast) => toast.id !== action.payload)
    },
  },
})

export const { addToast, removeToast } = systemSlice.actions
export default systemSlice.reducer
