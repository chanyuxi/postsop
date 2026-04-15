import type { SignInRequest, SignUpRequest } from '@postsop/contracts/auth'
import {
  signInEndpoint,
  signOutEndpoint,
  signUpEndpoint,
} from '@postsop/contracts/auth'

import { requestEndpoint } from '@/api'

export function requestSignIn(data: SignInRequest) {
  return requestEndpoint(signInEndpoint, { data })
}

export async function requestSignUp(data: SignUpRequest) {
  await requestEndpoint(signUpEndpoint, { data })
}

export async function requestSignOut() {
  await requestEndpoint(signOutEndpoint)
}
