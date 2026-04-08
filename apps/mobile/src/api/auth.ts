import type { SignInDto } from '@postsop/contracts/type'

import { post } from './index'

export function requestSignIn(params: SignInDto) {
  return post('/auth/sign-in', params)
}
