import { Injectable } from '@nestjs/common'

import type {
  RefreshTokenResponse,
  SignInRequest,
  SignInResponse,
  SignUpRequest,
} from '@postsop/contracts/auth'

import { RefreshAuthSessionUseCase } from '../use-cases/refresh-auth-session.use-case'
import { SignInUseCase } from '../use-cases/sign-in.use-case'
import { SignOutUseCase } from '../use-cases/sign-out.use-case'
import { SignUpUseCase } from '../use-cases/sign-up.use-case'

@Injectable()
export class AuthService {
  constructor(
    private readonly signUpUseCase: SignUpUseCase,
    private readonly signInUseCase: SignInUseCase,
    private readonly signOutUseCase: SignOutUseCase,
    private readonly refreshAuthSessionUseCase: RefreshAuthSessionUseCase,
  ) {}

  async signUp(signUpRequest: SignUpRequest) {
    await this.signUpUseCase.execute(signUpRequest)
  }

  async signIn(signInRequest: SignInRequest): Promise<SignInResponse> {
    return this.signInUseCase.execute(signInRequest)
  }

  async signOut(sessionId: string) {
    await this.signOutUseCase.execute(sessionId)
  }

  async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
    return this.refreshAuthSessionUseCase.execute(refreshToken)
  }
}
