import AsyncStorage from '@react-native-async-storage/async-storage'
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister'
import { QueryClient } from '@tanstack/react-query'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import type { PropsWithChildren } from 'react'

import { ApiError } from '@postsop/apis'

import { toast } from '@/libs/toast'

interface AppMutationMeta extends Record<string, unknown> {
  skipGlobalErrorHandler?: boolean
}

const persister = createAsyncStoragePersister({
  storage: AsyncStorage,
  throttleTime: 3000,
})

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        if (error instanceof ApiError) {
          // If there is a network error then we will retry
          if (error.isNetworkError) return failureCount < 2
        }
        // Otherwise, we will never retry
        return false
      },
    },
    mutations: {
      onError: (error, _variables, _onMutateResult, context) => {
        const meta = (context.meta ?? {}) as AppMutationMeta

        if (meta.skipGlobalErrorHandler) {
          return
        }

        if (error instanceof ApiError) {
          toast(error.displayMessage)
          return
        }

        if (__DEV__) {
          if (error instanceof Error) {
            console.error('Request failed due to', error.message)
          }
        }

        toast('Request failed')
      },
    },
  },
})

export async function clearPersistedQueryClient() {
  await queryClient.cancelQueries()
  queryClient.clear()
  await persister.removeClient()
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
