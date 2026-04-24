import { useEffect } from 'react'
import BootSplash from 'react-native-bootsplash'

import { clearPersistedQueryClient } from '@/libs/query-client'
import { clearAuthSession } from '@/services/auth/session'
import { signInAction } from '@/store/auth-slice'
import {
  getStoredAccessToken,
  getStoredRefreshToken,
  getStoredTheme,
  storage,
  SYSTEM_THEME,
} from '@/utils/storage'
import { setTheme } from '@/utils/theme'

import { useAppDispatch } from '../hooks/use-store'

export function useAppBootstrap() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    void (async () => {
      if (storage.contains(SYSTEM_THEME)) {
        setTheme(getStoredTheme())
      }

      const storedAccessToken = getStoredAccessToken()
      const storedRefreshToken = getStoredRefreshToken()

      if (storedAccessToken && storedRefreshToken) {
        dispatch(signInAction())
      } else if (storedAccessToken || storedRefreshToken) {
        await clearAuthSession()
      } else {
        await clearPersistedQueryClient()
      }

      await BootSplash.hide()
    })()
  }, [dispatch])
}
