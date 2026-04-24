import '../global.css'

import { GestureHandlerRootView } from 'react-native-gesture-handler'

import { AppShell } from './app-shell'
import { AppProviders } from './providers'

export default function App() {
  return (
    <GestureHandlerRootView>
      <AppProviders>
        <AppShell />
      </AppProviders>
    </GestureHandlerRootView>
  )
}
