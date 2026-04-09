import type { SignInResult } from '@postsop/contracts/type'

import { signInAction, signOutAction } from '@/store/authSlice'
import { clearStoredAuthSession, persistAuthSession } from '@/utils/storage'

import { useAppDispatch, useAppSelector } from './useStore'

export function useAuth() {
  const dispatch = useAppDispatch()

  const user = useAppSelector((state) => state.auth.user)

  const signIn = (authSession: SignInResult) => {
    persistAuthSession(authSession)
    dispatch(signInAction(authSession.user))
  }

  const signOut = () => {
    clearStoredAuthSession()
    dispatch(signOutAction())
  }

  return {
    isSignIn: !!user,
    user,
    signIn,
    signOut,
  }
}
