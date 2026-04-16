import type { AuthSession } from '@postsop/contracts/auth'

import { requestSignOut } from '@/services/auth/request'
import { applyAuthSession, clearAuthSession } from '@/services/auth/session'

import { useAppSelector } from './useStore'

export function useAuth() {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)

  const signIn = (authSession: AuthSession) => {
    applyAuthSession(authSession)
  }

  const signOut = async () => {
    try {
      await requestSignOut()
    } finally {
      await clearAuthSession()
    }
  }

  return {
    isSignIn: isAuthenticated,
    signIn,
    signOut,
  }
}
