import './global.css'

import { StatusBar, View } from 'react-native'
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context'

import { isAndroidAndVersionLargerThanOrEqualTo35 } from '@/constants'
import { AuthProvider } from '@/modules/auth'
import { RouteRender } from '@/routes'

function AppContent() {
  const safeAreaInsets = useSafeAreaInsets()

  const safeAreaStyles = {
    paddingLeft: safeAreaInsets.left,
    /**
     * In Android devices, the status bar after version 35 cannot be
     * colored, and compatibility with both scenarios will result in
     * some cumbersome code. Therefore, I am considering implementing
     * a custom status bar placeholder component, where padding Top
     * is no longer needed.
     */
    paddingTop: 0,
    paddingRight: safeAreaInsets.right,
    paddingBottom: safeAreaInsets.bottom,
  }

  return (
    <View
      style={safeAreaStyles}
      className="bg-background flex-1"
    >
      {!isAndroidAndVersionLargerThanOrEqualTo35 && (
        <StatusBar
          backgroundColor="transparent"
          translucent
        />
      )}
      <AuthProvider>
        <RouteRender />
      </AuthProvider>
    </View>
  )
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AppContent />
    </SafeAreaProvider>
  )
}
