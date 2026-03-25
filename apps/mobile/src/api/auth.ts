import type { SignInDto } from '@postsop/shared-contracts'

import { post } from './index'

export function requestSignIn(params: SignInDto) {
  return post('/auth/sign-in', params)
}
