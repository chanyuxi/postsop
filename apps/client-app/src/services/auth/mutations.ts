import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { SignInRequest, SignUpRequest } from '@postsop/contracts/auth'
import { ApiError } from '@postsop/contracts/http'

import { userKey } from '@/services/user/keys'

import { authKey } from './keys'
import { requestSignIn, requestSignOut, requestSignUp } from './request'
import { clearAuthSession } from './session'

export function useSignInMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (signInRequest: SignInRequest) =>
      requestSignIn(signInRequest),
    mutationKey: authKey.signIn(),

    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: userKey.profile() })
    },
  })
}

export function useSignOutMutation() {
  return useMutation({
    meta: {
      skipGlobalErrorHandler: true,
    },
    mutationFn: async () => requestSignOut(),
    mutationKey: authKey.signOut(),

    onError: (error) => {
      if (
        error instanceof ApiError &&
        (error.isTokenExpired || error.isTokenInvalid || error.isUnauthorized)
      ) {
        return
      }

      if (__DEV__) {
        console.error(
          'Signed out locally, but we could not notify the server',
          error
        )
      }
    },

    onSettled: async () => {
      await clearAuthSession()
    },
  })
}

export function useSignUpMutation() {
  return useMutation({
    mutationFn: (signUpRequest: SignUpRequest) => requestSignUp(signUpRequest),
    mutationKey: authKey.signUp(),
  })
}
