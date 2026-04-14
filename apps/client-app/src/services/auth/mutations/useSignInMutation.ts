import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { SignInRequest } from '@postsop/contracts/auth'

import { userKey } from '@/services/queryKeys'

import { requestSignIn } from '../request'

export function useSignInMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (signInRequest: SignInRequest) => requestSignIn(signInRequest),
    mutationKey: ['auth', 'sign-in'],

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKey.profile() })
    },
  })
}
