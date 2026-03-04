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

function AppContent() {
  const safeAreaStyles = useSafeAreaStyles()

  const configStatusBar =
    !IS_ANDROID_AND_VERSION_LARGER_THAN_OR_EQUAL_TO_35 && (
      <StatusBar
        backgroundColor="transparent"
        translucent
      />
    )

  useEffect(() => {
    BootSplash.hide({ fade: true })
  }, [])

  return (
    <View
      style={safeAreaStyles}
      className="bg-background flex-1"
    >
      {configStatusBar}
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
