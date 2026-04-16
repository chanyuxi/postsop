import { Injectable } from '@nestjs/common'

import type {
  AuthTokens,
  SessionUser,
  SignInRequest,
  SignInResponse,
} from '@postsop/contracts/auth'

import { AppException } from '@/common/exceptions/app.exception'
import { verifyPassword } from '@/common/utils/password.util'
import { UserAuthQueryService } from '@/modules/user/queries/user-auth.query.service'

import type { AuthSession } from '../interfaces/auth-session.interface'
import type { JwtPayload } from '../interfaces/jwt-payload.interface'
import { AccessTokenService } from '../services/access-token.service'
import { RefreshSessionService } from '../services/refresh-session.service'

@Injectable()
export class SignInUseCase {
  constructor(
    private readonly userAuthQueryService: UserAuthQueryService,
    private readonly refreshSessionService: RefreshSessionService,
    private readonly accessTokenService: AccessTokenService,
  ) {}

  async execute(signInRequest: SignInRequest): Promise<SignInResponse> {
    const user = await this.userAuthQueryService.findUserForSignInByEmail(
      signInRequest.email,
    )

    if (
      !user ||
      !(await verifyPassword(signInRequest.password, user.password))
    ) {
      throw AppException.unauthorized('Invalid email or password')
    }

    const session = await this.refreshSessionService.createSession(user.id)
    return this.createAuthResponse(session, user.sessionUser)
  }

  private async createAuthResponse(
    session: AuthSession,
    user: SessionUser,
  ): Promise<SignInResponse> {
    const tokens = await this.issueTokenPair(session)

    return {
      tokens,
      user,
    }
  }

  private async issueTokenPair(session: AuthSession): Promise<AuthTokens> {
    const jwtPayload: JwtPayload = {
      user: {
        id: session.userId,
      },
      sessionId: session.sessionId,
    }

    const accessToken =
      await this.accessTokenService.generateAccessToken(jwtPayload)

    return {
      accessToken,
      refreshToken: session.refreshToken,
    }
  }
}
