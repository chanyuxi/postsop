import AsyncStorage from '@react-native-async-storage/async-storage'
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister'
import { QueryClient } from '@tanstack/react-query'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import type { PropsWithChildren } from 'react'

import { ApiError } from '@/api/error'

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

export function Provider({ children }: PropsWithChildren) {
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister }}
    >
      {children}
    </PersistQueryClientProvider>
  )
}
