import { Injectable } from '@nestjs/common'

import type {
  AuthTokens,
  RefreshTokenResponse,
  SignInRequest,
  SignInResponse,
  SignUpRequest,
} from '@postsop/contracts/auth'

import { AppException } from '@/common/exceptions/app.exception'
import { verifyPassword } from '@/common/utils/password.util'
import type { SessionUserSource } from '@/modules/user/serializers/session-user.serializer'
import { toSessionUser } from '@/modules/user/serializers/session-user.serializer'
import { UserService } from '@/modules/user/services/user.service'

import type { JwtPayload } from '../interfaces/jwt-payload.interface'
import type { AuthSession } from './token.service'
import { TokenService } from './token.service'

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
  ) {}

  async signUp(signUpRequest: SignUpRequest) {
    const user = await this.userService.createUser(signUpRequest)

    if (!user) {
      throw AppException.resourceAlreadyExists('User already exists')
    }
  }

  async signIn(signInRequest: SignInRequest): Promise<SignInResponse> {
    const user = await this.userService.findUserForSignInByEmail(
      signInRequest.email,
    )

    if (
      !user ||
      !(await verifyPassword(signInRequest.password, user.password))
    ) {
      throw AppException.unauthorized('Invalid email or password')
    }

    const session = await this.tokenService.createSession(user.id)
    return this.issueAuthSession(session, user)
  }

  async signOut(sessionId: string) {
    await this.tokenService.invalidateSession(sessionId)
  }

  async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
    const session = await this.tokenService.rotateSession(refreshToken)
    const user = await this.userService.findSessionUserById(session.userId)

    if (!user) {
      await this.tokenService.invalidateSession(session.sessionId)
      throw AppException.tokenInvalid('Refresh token user no longer exists')
    }

    return this.issueAuthSession(session, user)
  }

  private async issueAuthSession(
    session: AuthSession,
    user: SessionUserSource,
  ): Promise<SignInResponse> {
    const tokens = await this.issueTokenPair(session)

    return {
      tokens,
      user: toSessionUser(user),
    }
  }

  private async issueTokenPair(session: AuthSession): Promise<AuthTokens> {
    const jwtPayload: JwtPayload = {
      user: {
        id: session.userId,
      },
      sessionId: session.sessionId,
    }

    const accessToken = await this.tokenService.generateAccessToken(jwtPayload)

    return {
      accessToken,
      refreshToken: session.refreshToken,
    }
  }
}
