import { useMutation } from '@tanstack/react-query'

import type { SignUpRequest } from '@postsop/contracts/auth'

import { requestSignUp } from '../request'

export function useSignUpMutation() {
  return useMutation({
    mutationFn: (signUpRequest: SignUpRequest) => requestSignUp(signUpRequest),
    mutationKey: ['auth', 'sign-up'],
  })
}
