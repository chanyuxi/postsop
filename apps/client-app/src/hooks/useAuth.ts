import type { AuthSession } from '@postsop/contracts/auth'

import { useSignOutMutation } from '@/services/auth/mutations'
import { applyAuthSession } from '@/services/auth/session'

import { useAppSelector } from './useStore'

export function useAuth() {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)
  const signOutMutation = useSignOutMutation()

  const signIn = (authSession: AuthSession) => {
    applyAuthSession(authSession)
  }

  const signOut = async () => {
    if (signOutMutation.isPending) {
      return
    }

    await signOutMutation.mutateAsync()
  }

  return {
    isSignIn: isAuthenticated,
    isSignOuting: signOutMutation.isPending,
    signIn,
    signOut,
  }
}
