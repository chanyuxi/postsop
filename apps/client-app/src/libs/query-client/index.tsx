import AsyncStorage from '@react-native-async-storage/async-storage'
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister'
import { QueryClient } from '@tanstack/react-query'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import type { PropsWithChildren } from 'react'

import { ApiError } from '@/api/error'
import { toast } from '@/libs/toast'
import { store } from '@/store'
import { signOutAction } from '@/store/authSlice'
import { clearStoredAuthSession } from '@/utils/storage'

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
          if (error.needsReLogin || error.type === 'business') return false

          if (error.isNetworkError || error.isServerError)
            return failureCount < 2
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
  if (error.needsReLogin) {
    clearStoredAuthSession()
    store.dispatch(signOutAction())
  }

  toast(error.displayMessage)
}

const handleUnknownError = (error: unknown) => {
  if (error instanceof Error) {
    toast(error.message)
    return
  }

  toast('Request failed')
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
