import { useEffect } from 'react'
import BootSplash from 'react-native-bootsplash'

import { clearPersistedQueryClient } from '@/libs/query-client'
import { clearAuthSession } from '@/services/auth/session'
import { signInAction } from '@/store/authSlice'
import {
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
    void (async () => {
      if (storage.contains(StrorageKeys.THEME)) {
        setTheme(storage.getString(StrorageKeys.THEME) as ThemeName)
      }

      const storedAccessToken = getStoredAccessToken()
      const storedRefreshToken = getStoredRefreshToken()
      const storedUser = getStoredUser()

      if (storedAccessToken && storedRefreshToken && storedUser) {
        dispatch(signInAction(storedUser))
      } else if (storedAccessToken || storedRefreshToken || storedUser) {
        await clearAuthSession()
      } else {
        await clearPersistedQueryClient()
      }

      await BootSplash.hide()
    })()
  }, [dispatch])
}
