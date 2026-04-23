import type { AuthSession } from '@postsop/contracts/auth'

import { clearPersistedQueryClient } from '@/libs/query-client'
import { store } from '@/store'
import { signInAction, signOutAction } from '@/store/auth-slice'
import { clearStoredAuthSession, persistAuthorization } from '@/utils/storage'

let clearAuthSessionPromise: Promise<void> | null = null

export function applyAuthSession(authSession: AuthSession) {
  persistAuthorization(authSession)
  store.dispatch(signInAction())
}

export async function clearAuthSession() {
  if (clearAuthSessionPromise) {
    return clearAuthSessionPromise
  }

  clearAuthSessionPromise = (async () => {
    clearStoredAuthSession()
    store.dispatch(signOutAction())
    await clearPersistedQueryClient()
  })().finally(() => {
    clearAuthSessionPromise = null
  })

  return clearAuthSessionPromise
}
