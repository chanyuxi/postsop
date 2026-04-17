import { ApiError } from '@postsop/apis'
import type { AuthSession } from '@postsop/contracts/auth'

import { toast } from '@/libs/toast'
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
    } catch (error) {
      if (
        error instanceof ApiError &&
        (error.isTokenExpired || error.isTokenInvalid || error.isUnauthorized)
      ) {
        return
      }

      toast('Signed out locally, but we could not notify the server')

      if (__DEV__) {
        console.error('Failed to sign out cleanly', error)
      }
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
