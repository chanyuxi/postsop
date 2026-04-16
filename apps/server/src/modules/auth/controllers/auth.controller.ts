import type {
  RefreshTokenRequest,
  SignInRequest,
  SignUpRequest,
} from '@postsop/contracts/auth'
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

import { RefreshAuthSessionUseCase } from '../use-cases/refresh-auth-session.use-case'
import { SignInUseCase } from '../use-cases/sign-in.use-case'
import { SignOutUseCase } from '../use-cases/sign-out.use-case'
import { SignUpUseCase } from '../use-cases/sign-up.use-case'

@EndpointController('auth')
export class AuthController {
  constructor(
    private readonly signUpUseCase: SignUpUseCase,
    private readonly signInUseCase: SignInUseCase,
    private readonly signOutUseCase: SignOutUseCase,
    private readonly refreshAuthSessionUseCase: RefreshAuthSessionUseCase,
  ) {}

  @Public()
  @EndpointHandler(signUpEndpoint)
  signUp(@EndpointBody(signUpEndpoint) signUpRequest: SignUpRequest) {
    return this.signUpUseCase.execute(signUpRequest)
  }

  @Public()
  @EndpointHandler(signInEndpoint)
  signIn(@EndpointBody(signInEndpoint) signInRequest: SignInRequest) {
    return this.signInUseCase.execute(signInRequest)
  }

  @EndpointHandler(signOutEndpoint)
  signOut(@AuthContext('sid') sessionId: string) {
    return this.signOutUseCase.execute(sessionId)
  }

  @Public()
  @EndpointHandler(refreshTokenEndpoint)
  refresh(
    @EndpointBody(refreshTokenEndpoint)
    refreshTokenRequest: RefreshTokenRequest,
  ) {
    return this.refreshAuthSessionUseCase.execute(
      refreshTokenRequest.refreshToken,
    )
  }
}
