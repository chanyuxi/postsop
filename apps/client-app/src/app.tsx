import './global.css'

import { View } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { Provider as StoreProvider } from 'react-redux'

import {
  useAppInit,
  useFocusManager,
  useOnlineStateManager,
  useSafeAreaStyles,
} from '@/hooks'
import { NotificationAttacher } from '@/libs/notification/notification-attacher'
import { Provider as PersistQueryClientProvider } from '@/libs/query-client'
import { ToastAttacher } from '@/libs/toast/toast-attacher'
import { RootStack } from '@/routes'
import { store } from '@/store'

function AppContent() {
  const safeAreaStyles = useSafeAreaStyles()

  useFocusManager()
  useOnlineStateManager()
  useAppInit()

  return (
    <View
      className="bg-background flex-1"
      style={safeAreaStyles}
    >
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
            <NotificationAttacher />
            <ToastAttacher />
          </PersistQueryClientProvider>
        </StoreProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}
