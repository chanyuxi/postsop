import { useMutation } from '@tanstack/react-query'

import type { SignUpDto } from '@postsop/contracts/type'

import { requestSignUp } from '../request'

export function useSignUpMutation() {
  return useMutation({
    mutationFn: (signUpDto: SignUpDto) => requestSignUp(signUpDto),
    mutationKey: ['auth', 'sign-up'],
  })
}
