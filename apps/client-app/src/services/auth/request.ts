import type {
  SignInDto,
  SignInResult,
  SignUpDto,
} from '@postsop/contracts/types'

import { post } from '@/api'

export function requestSignIn(params: SignInDto): Promise<SignInResult> {
  return post<SignInResult>('/auth/sign-in', params)
}

export async function requestSignUp(params: SignUpDto): Promise<void> {
  await post('/auth/sign-up', params)
}
