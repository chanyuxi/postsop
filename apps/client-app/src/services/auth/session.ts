import type { AuthSession } from '@postsop/contracts/auth'

import { clearPersistedQueryClient } from '@/libs/query-client'
import { store } from '@/store'
import { signInAction, signOutAction } from '@/store/authSlice'
import { clearStoredAuthSession, persistAuthSession } from '@/utils/storage'

let clearAuthSessionPromise: Promise<void> | null = null

export function applyAuthSession(authSession: AuthSession) {
  persistAuthSession(authSession)
  store.dispatch(signInAction(authSession.user))
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
