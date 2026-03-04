import { signInAction, signOutAction } from '@/store/authSlice'

import { useAppDispatch, useAppSelector } from './useStore'

export function useAuth() {
  const dispatch = useAppDispatch()

  const user = useAppSelector((state) => state.auth.user)

  const signIn = () => dispatch(signInAction())

  const signOut = () => dispatch(signOutAction())

  return {
    isSignIn: !!user,
    user,
    signIn,
    signOut,
  }
}
