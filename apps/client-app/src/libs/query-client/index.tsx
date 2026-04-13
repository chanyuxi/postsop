import AsyncStorage from '@react-native-async-storage/async-storage'
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister'
import { QueryClient } from '@tanstack/react-query'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import type { PropsWithChildren } from 'react'

import { ApiError, ApiErrorType } from '@postsop/apis'

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
          if (error.needsRefresh || error.type === ApiErrorType.Internal)
            return false

          if (error.isNetworkError || error.isTimeout) return failureCount < 2
        }
        return false
      },
    },
    mutations: {
      onError: (error, _variables, _onMutateResult, context) => {
        const meta = getMutationMeta(context.meta)

        if (meta.skipGlobalErrorHandler) {
          return
        }

        if (error instanceof ApiError) {
          handleError(error)
          return
        }

        handleUnknownError(error)
      },
    },
  },
})

function getMutationMeta(
  meta: Record<string, unknown> | undefined
): AppMutationMeta {
  return (meta ?? {}) as AppMutationMeta
}

const handleError = (error: ApiError) => {
  toast(error.displayMessage)
}

const handleUnknownError = (error: unknown) => {
  if (error instanceof Error) {
    toast(error.message)
    return
  }

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
