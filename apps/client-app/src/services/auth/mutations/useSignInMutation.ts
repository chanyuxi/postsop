import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { SignInSchema } from '@postsop/contracts/schemas'

import { userKey } from '@/services/queryKeys'

import { requestSignIn } from '../request'

export function useSignInMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (signInSchema: SignInSchema) => requestSignIn(signInSchema),
    mutationKey: ['auth', 'sign-in'],

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKey.profile() })
    },
  })
}
