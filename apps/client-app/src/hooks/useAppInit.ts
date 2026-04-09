import { useEffect } from 'react'
import BootSplash from 'react-native-bootsplash'

import { signInAction } from '@/store/authSlice'
import {
  clearStoredAuthSession,
  getStoredAccessToken,
  getStoredRefreshToken,
  getStoredUser,
  storage,
  StrorageKeys,
} from '@/utils/storage'
import type { ThemeName } from '@/utils/theme'
import { setTheme } from '@/utils/theme'

import { useAppDispatch } from './useStore'

export function useAppInit() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (storage.contains(StrorageKeys.THEME)) {
      setTheme(storage.getString(StrorageKeys.THEME) as ThemeName)
    }

    const storedAccessToken = getStoredAccessToken()
    const storedRefreshToken = getStoredRefreshToken()
    const storedUser = getStoredUser()

    if (storedAccessToken && storedRefreshToken && storedUser) {
      dispatch(signInAction(storedUser))
    } else if (storedAccessToken || storedRefreshToken || storedUser) {
      clearStoredAuthSession()
    }

    BootSplash.hide()
  }, [dispatch])
}
