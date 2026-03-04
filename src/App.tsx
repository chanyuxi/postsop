import './global.css'

import { useEffect } from 'react'
import { StatusBar, View } from 'react-native'
import BootSplash from 'react-native-bootsplash'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { Provider as StoreProvider } from 'react-redux'

import { IS_ANDROID_AND_VERSION_LARGER_THAN_OR_EQUAL_TO_35 } from '@/constants'
import { useSafeAreaStyles } from '@/hooks/useSafeAreaStyles'
import { RootStack } from '@/routes'
import { store } from '@/store'
import { storage, StrorageKeys } from '@/utils/storage'
import { setTheme, type ThemeName } from '@/utils/theme'

function AppContent() {
  const safeAreaStyles = useSafeAreaStyles()

  // Given the introduction of Android edge-to-edge mode, we will uniformly
  // use custom <StatusBarPlaceholder /> to manage the status bar
  const ConfigureStatusBar =
    !IS_ANDROID_AND_VERSION_LARGER_THAN_OR_EQUAL_TO_35 && (
      <StatusBar
        backgroundColor="transparent"
        translucent
      />
    )

  useEffect(() => {
    if (storage.contains(StrorageKeys.THEME)) {
      setTheme(storage.getString(StrorageKeys.THEME) as ThemeName)
    }

    BootSplash.hide()
  }, [])

  return (
    <View
      style={safeAreaStyles}
      className="bg-background flex-1"
    >
      {ConfigureStatusBar}
      <RootStack />
    </View>
  )
}

export default function App() {
  return (
    <SafeAreaProvider>
      <StoreProvider store={store}>
        <AppContent />
      </StoreProvider>
    </SafeAreaProvider>
  )
}
