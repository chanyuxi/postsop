import {
  authEndpoints,
  type SignInRequest,
  type SignUpRequest,
} from '@postsop/contracts/auth'

import { requestEndpoint } from '@/api'

export function requestSignIn(data: SignInRequest) {
  return requestEndpoint(authEndpoints.signIn, { data })
}

export async function requestSignUp(data: SignUpRequest) {
  await requestEndpoint(authEndpoints.signUp, { data })
}

export async function requestSignOut() {
  await requestEndpoint(authEndpoints.signOut)
}
