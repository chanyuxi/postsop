import { useMutation } from '@tanstack/react-query'

import type { SignUpSchema } from '@postsop/contracts/schemas'

import { requestSignUp } from '../request'

export function useSignUpMutation() {
  return useMutation({
    mutationFn: (signUpSchema: SignUpSchema) => requestSignUp(signUpSchema),
    mutationKey: ['auth', 'sign-up'],
  })
}
