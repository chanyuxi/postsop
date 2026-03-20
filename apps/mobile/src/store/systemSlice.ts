import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { nanoid } from '@reduxjs/toolkit'

import { type Toast } from '@/types/system'

interface SystemState {
  activatedToast: Toast | null
}

const toastQueue: Toast[] = []

const initialState: SystemState = {
  activatedToast: null,
}

export const systemSlice = createSlice({
  name: 'system',
  initialState,
  reducers: {
    scheduleToast: (state, action: PayloadAction<Omit<Toast, 'id'>>) => {
      const toast = {
        id: nanoid(),
        ...action.payload,
      }

      if (state.activatedToast === null) {
        state.activatedToast = toast
      } else {
        toastQueue.push(toast)
      }
    },
    nextToast: (state) => {
      state.activatedToast = toastQueue.shift() || null
    },
  },
})

export const { scheduleToast, nextToast } = systemSlice.actions
export default systemSlice.reducer
