import type {
  SignInDto,
  SignInResult,
  SignUpDto,
} from '@postsop/contracts/type'

import { post } from './index'

export function requestSignIn(params: SignInDto) {
  return post<SignInResult>('/auth/sign-in', params)
}

export function requestSignUp(params: SignUpDto) {
  return post<null>('/auth/sign-up', params)
}
