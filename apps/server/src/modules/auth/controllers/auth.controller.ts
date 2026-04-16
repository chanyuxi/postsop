import type { ApiEndpointData } from '@postsop/contracts'
import {
  refreshTokenEndpoint,
  signInEndpoint,
  signOutEndpoint,
  signUpEndpoint,
} from '@postsop/contracts/auth'

import {
  AuthContext,
  EndpointBody,
  EndpointController,
  EndpointHandler,
  Public,
} from '@/common/decorators'

import { AuthService } from '../services/auth.service'

type RefreshTokenRequest = ApiEndpointData<typeof refreshTokenEndpoint>
type SignInRequest = ApiEndpointData<typeof signInEndpoint>
type SignUpRequest = ApiEndpointData<typeof signUpEndpoint>

@EndpointController('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @EndpointHandler(signUpEndpoint)
  signUp(@EndpointBody(signUpEndpoint) signUpRequest: SignUpRequest) {
    return this.authService.signUp(signUpRequest)
  }

  @Public()
  @EndpointHandler(signInEndpoint)
  signIn(@EndpointBody(signInEndpoint) signInRequest: SignInRequest) {
    return this.authService.signIn(signInRequest)
  }

  @EndpointHandler(signOutEndpoint)
  signOut(@AuthContext('sessionId') sessionId: string) {
    return this.authService.signOut(sessionId)
  }

  @Public()
  @EndpointHandler(refreshTokenEndpoint)
  refresh(
    @EndpointBody(refreshTokenEndpoint)
    refreshTokenRequest: RefreshTokenRequest,
  ) {
    return this.authService.refreshToken(refreshTokenRequest.refreshToken)
  }
}
