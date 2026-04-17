import { Controller } from '@nestjs/common'

import type {
  RefreshRequest,
  SignInRequest,
  SignUpRequest,
} from '@postsop/contracts/auth'
import {
  refreshEndpoint,
  signInEndpoint,
  signOutEndpoint,
  signUpEndpoint,
} from '@postsop/contracts/auth'

import { AuthContext } from '@/common/decorators/auth-context.decorator'
import { EndpointBody } from '@/common/decorators/endpoint-body.decorator'
import { EndpointHandler } from '@/common/decorators/endpoint-handler.decorator'
import { Public } from '@/common/decorators/public.decorator'

import { RefreshAuthSessionUseCase } from '../use-cases/refresh-auth-session.use-case'
import { SignInUseCase } from '../use-cases/sign-in.use-case'
import { SignOutUseCase } from '../use-cases/sign-out.use-case'
import { SignUpUseCase } from '../use-cases/sign-up.use-case'

@Controller()
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
  @EndpointHandler(refreshEndpoint)
  refresh(
    @EndpointBody(refreshEndpoint)
    refreshRequest: RefreshRequest,
  ) {
    return this.refreshAuthSessionUseCase.execute(refreshRequest.refreshToken)
  }
}
