import { authEndpoints } from '@postsop/contracts/endpoints'
import type {
  SignInResult,
  SignInSchema,
  SignUpSchema,
} from '@postsop/contracts/schemas'

import { requestEndpoint } from '@/api/helpers'

export function requestSignIn(params: SignInSchema): Promise<SignInResult> {
  return requestEndpoint(authEndpoints.signIn, params)
}

export async function requestSignUp(params: SignUpSchema): Promise<void> {
  await requestEndpoint(authEndpoints.signUp, params)
}

export async function requestSignOut(): Promise<void> {
  await requestEndpoint(authEndpoints.signOut)
}
