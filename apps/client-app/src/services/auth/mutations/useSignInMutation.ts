import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { SignInDto } from '@postsop/contracts/type'

import { userKey } from '@/services/queryKeys'

import { requestSignIn } from '../request'

export function useSignInMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (signInDto: SignInDto) => requestSignIn(signInDto),
    mutationKey: ['auth', 'sign-in'],

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKey.profile() })
    },
  })
}
