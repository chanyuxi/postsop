import { signInAction, signOutAction } from '@/store/authSlice'
import { type User } from '@/types/system'
import { storage, StrorageKeys } from '@/utils/storage'

import { useAppDispatch, useAppSelector } from './useStore'

export function useAuth() {
  const dispatch = useAppDispatch()

  const user = useAppSelector((state) => state.auth.user)

  const signIn = (user: User) => dispatch(signInAction(user))

  const signOut = () => {
    storage.remove(StrorageKeys.TOKEN)
    dispatch(signOutAction())
  }

  return {
    isSignIn: !!user,
    user,
    signIn,
    signOut,
  }
}
