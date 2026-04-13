import { ApiError } from '@postsop/apis'
import type { SignInResult } from '@postsop/contracts/schemas'

import { toast } from '@/libs/toast'
import { requestSignOut } from '@/services/auth/request'
import { applyAuthSession, clearAuthSession } from '@/services/auth/session'

import { useAppSelector } from './useStore'

export function useAuth() {
  const user = useAppSelector((state) => state.auth.user)

  const signIn = (authSession: SignInResult) => {
    applyAuthSession(authSession)
  }

  const signOut = async () => {
    try {
      await requestSignOut()
    } catch (error) {
      if (error instanceof ApiError) {
        if (!error.needsRefresh) {
          toast(error.displayMessage)
        }
      } else if (error instanceof Error) {
        toast(error.message)
      }
    } finally {
      await clearAuthSession()
    }
  }

  return {
    isSignIn: !!user,
    user,
    signIn,
    signOut,
  }
}
