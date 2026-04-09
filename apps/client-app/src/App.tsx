import './global.css'

import AsyncStorage from '@react-native-async-storage/async-storage'
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister'
import { QueryClient } from '@tanstack/react-query'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { useEffect } from 'react'
import { StatusBar, View } from 'react-native'
import BootSplash from 'react-native-bootsplash'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { Provider as StoreProvider } from 'react-redux'

import { ApiError } from '@/api/error'
import { IS_ANDROID_AND_VERSION_LARGER_THAN_OR_EQUAL_TO_35 } from '@/constants'
import { useFocusManager, useOnlineManager, useSafeAreaStyles } from '@/hooks'
import { ToastAttacher } from '@/libs/toast/ToastAttacher'
import { RootStack } from '@/routes'
import { store } from '@/store'
import { signInAction } from '@/store/authSlice'
import {
  clearStoredAuthSession,
  getStoredAccessToken,
  getStoredRefreshToken,
  getStoredUser,
  storage,
  StrorageKeys,
} from '@/utils/storage'
import { setTheme, type ThemeName } from '@/utils/theme'

import { useAppDispatch } from './hooks'

const persister = createAsyncStoragePersister({
  storage: AsyncStorage,
  throttleTime: 3000,
})

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        if (error instanceof ApiError) {
          if (error.needsReLogin || error.type === 'business') return false

          if (error.isNetworkError || error.isServerError)
            return failureCount < 2
        }
        return false
      },
    },
    mutations: {
      onError: (error) => {
        if (error instanceof ApiError) {
          handleError(error)
        }
      },
    },
  },
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const handleError = (error: ApiError) => {
  // TODO: Handle error
}

function AppContent() {
  const safeAreaStyles = useSafeAreaStyles()

  const dispatch = useAppDispatch()

  // Given the introduction of Android edge-to-edge mode, we will uniformly
  // use custom <StatusBarPlaceholder /> to manage the status bar
  const ConfigureStatusBar =
    !IS_ANDROID_AND_VERSION_LARGER_THAN_OR_EQUAL_TO_35 && (
      <StatusBar
        translucent
        backgroundColor="transparent"
      />
    )

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

  useFocusManager()
  useOnlineManager()

  return (
    <View
      className="bg-background flex-1"
      style={safeAreaStyles}
    >
      {ConfigureStatusBar}
      <RootStack />
    </View>
  )
}

export default function App() {
  return (
    <GestureHandlerRootView>
      <SafeAreaProvider>
        <StoreProvider store={store}>
          <PersistQueryClientProvider
            client={queryClient}
            persistOptions={{ persister }}
          >
            <AppContent />
            <ToastAttacher />
          </PersistQueryClientProvider>
        </StoreProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}
