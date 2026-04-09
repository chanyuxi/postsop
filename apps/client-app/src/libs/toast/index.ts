import { store } from '@/store'
import { scheduleToast } from '@/store/systemSlice'

interface ToastOptions {
  message: string
  duration?: number
}

export function toast(options: ToastOptions | string) {
  if (typeof options === 'string') options = { message: options }

  const { message, duration = 3000 } = options

  store.dispatch(scheduleToast({ message, duration }))
}
