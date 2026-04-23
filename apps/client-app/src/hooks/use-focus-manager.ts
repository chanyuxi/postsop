import { focusManager } from '@tanstack/react-query'
import { useEffect } from 'react'
import type { AppStateStatus } from 'react-native'
import { AppState } from 'react-native'

export function useFocusManager() {
  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      (status: AppStateStatus) => {
        focusManager.setFocused(status === 'active')
      }
    )
    return () => subscription.remove()
  }, [])
}
