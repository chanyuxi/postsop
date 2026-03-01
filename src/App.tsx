import './global.css'

import { StatusBar, View } from 'react-native'
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context'
import { useCSSVariable } from 'uniwind'

import { isAndroidVersionLargerThan35 } from '@/constants'
import { AuthProvider } from '@/contexts/auth'
import { RouteRender } from '@/routes'

function AppContent() {
  const safeAreaInsets = useSafeAreaInsets()

  const safeAreaStyles = {
    paddingLeft: safeAreaInsets.left,
    paddingTop: isAndroidVersionLargerThan35 ? 0 : safeAreaInsets.top,
    paddingRight: safeAreaInsets.right,
    paddingBottom: safeAreaInsets.bottom,
  }

  return (
    <View
      style={safeAreaStyles}
      className="flex-1"
    >
      <AuthProvider>
        <RouteRender />
      </AuthProvider>
    </View>
  )
}

export default function App() {
  // TODO: This doesn't seem very good and needs optimization
  const backgroundColor = useCSSVariable('--color-background') as string

  return (
    <SafeAreaProvider>
      {!isAndroidVersionLargerThan35 && (
        <StatusBar backgroundColor={backgroundColor} />
      )}
      <AppContent />
    </SafeAreaProvider>
  )
}
