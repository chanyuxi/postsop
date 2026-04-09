import './global.css'

import { StatusBar, View } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { Provider as StoreProvider } from 'react-redux'

import { IS_ANDROID_AND_VERSION_LARGER_THAN_OR_EQUAL_TO_35 } from '@/constants'
import {
  useAppInit,
  useFocusManager,
  useOnlineStateManager,
  useSafeAreaStyles,
} from '@/hooks'
import { Provider as PersistQueryClientProvider } from '@/libs/query-client'
import { ToastAttacher } from '@/libs/toast/ToastAttacher'
import { RootStack } from '@/routes'
import { store } from '@/store'

function AppContent() {
  const safeAreaStyles = useSafeAreaStyles()

  useFocusManager()
  useOnlineStateManager()
  useAppInit()

  // Given the introduction of Android edge-to-edge mode, we will uniformly
  // use custom <StatusBarPlaceholder /> to manage the status bar
  const ConfigureStatusBar =
    !IS_ANDROID_AND_VERSION_LARGER_THAN_OR_EQUAL_TO_35 && (
      <StatusBar
        translucent
        backgroundColor="transparent"
      />
    )

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
          <PersistQueryClientProvider>
            <AppContent />
            <ToastAttacher />
          </PersistQueryClientProvider>
        </StoreProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}
