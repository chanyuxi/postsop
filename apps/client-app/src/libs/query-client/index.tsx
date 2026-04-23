import AsyncStorage from '@react-native-async-storage/async-storage'
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister'
import { QueryCache, QueryClient } from '@tanstack/react-query'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import type { PropsWithChildren } from 'react'

import { ApiError } from '@postsop/contracts/http'

import { toast } from '@/libs/toast'

interface AppRequestMeta extends Record<string, unknown> {
  skipGlobalErrorHandler?: boolean | ((error: unknown) => boolean)
}

const persister = createAsyncStoragePersister({
  storage: AsyncStorage,
  throttleTime: 3000,
})

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => {
      // Avoid interrupting the user when a background refetch fails but stale
      // data is already available on screen.
      if (query.state.data !== undefined) {
        return
      }

      handleGlobalQueryError(error, (query.meta ?? {}) as AppRequestMeta)
    },
  }),
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        if (error instanceof ApiError) {
          // If there is a network error then we will retry
          if (error.isNetworkError || error.isTimeout) return failureCount < 2
        }
        // Otherwise, we will never retry
        return false
      },
    },
    mutations: {
      onError: (error, _variables, _onMutateResult, context) => {
        handleGlobalMutationError(error, (context.meta ?? {}) as AppRequestMeta)
      },
    },
  },
})

function shouldSkipGlobalErrorHandler(
  meta: AppRequestMeta | undefined,
  error: unknown
) {
  const skipGlobalErrorHandler = meta?.skipGlobalErrorHandler

  return typeof skipGlobalErrorHandler === 'function'
    ? skipGlobalErrorHandler(error)
    : skipGlobalErrorHandler
}

function logUnhandledRequestError(error: unknown) {
  if (__DEV__ && error instanceof Error) {
    console.error('Request failed due to', error.message)
  }
}

function handleGlobalQueryError(error: unknown, meta?: AppRequestMeta) {
  if (shouldSkipGlobalErrorHandler(meta, error)) {
    return
  }

  if (error instanceof ApiError) {
    // Query failures are often recovered by retries or can happen during
    // background refreshes, so only surface transport-level issues globally.
    if (error.isNetworkError || error.isTimeout || error.isConfigError) {
      toast(error.displayMessage)
    }
    return
  }

  logUnhandledRequestError(error)
}

function handleGlobalMutationError(error: unknown, meta?: AppRequestMeta) {
  if (shouldSkipGlobalErrorHandler(meta, error)) {
    return
  }

  if (error instanceof ApiError) {
    toast(error.displayMessage)
    return
  }

  logUnhandledRequestError(error)
  toast('Request failed')
}

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
