import {
  authEndpoints,
  type SignInRequest,
  type SignUpRequest,
} from '@postsop/contracts/auth'

import { requestEndpoint } from '@/api'

export function requestSignIn(params: SignInRequest) {
  return requestEndpoint(authEndpoints.signIn, params)
}

export async function requestSignUp(params: SignUpRequest) {
  await requestEndpoint(authEndpoints.signUp, params)
}

export async function requestSignOut() {
  await requestEndpoint(authEndpoints.signOut)
}
