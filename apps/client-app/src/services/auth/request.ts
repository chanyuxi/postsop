import type {
  SignInResult,
  SignInSchema,
  SignUpSchema,
} from '@postsop/contracts/schemas'

import { post } from '@/api'

export function requestSignIn(params: SignInSchema): Promise<SignInResult> {
  return post<SignInResult>('/auth/sign-in', params)
}

export async function requestSignUp(params: SignUpSchema): Promise<void> {
  await post('/auth/sign-up', params)
}
