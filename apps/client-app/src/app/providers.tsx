import type { PropsWithChildren } from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { Provider as StoreProvider } from 'react-redux'

import { Provider as PersistQueryClientProvider } from '@/libs/query-client'
import { store } from '@/store'

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <SafeAreaProvider>
      <StoreProvider store={store}>
        <PersistQueryClientProvider>{children}</PersistQueryClientProvider>
      </StoreProvider>
    </SafeAreaProvider>
  )
}
