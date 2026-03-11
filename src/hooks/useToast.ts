import { useCallback } from 'react'

import { scheduleToast } from '@/store/systemSlice'

import { useAppDispatch } from './useStore'

interface ToastOptions {
  message: string
  duration?: number
}

export function useToast() {
  const dispatch = useAppDispatch()

  const toast = useCallback(
    (options: ToastOptions | string) => {
      if (typeof options === 'string') {
        options = { message: options }
      }

      const { message, duration = 3000 } = options

      dispatch(
        scheduleToast({
          message,
          duration,
        })
      )
    },
    [dispatch]
  )

  return {
    toast,
  }
}
