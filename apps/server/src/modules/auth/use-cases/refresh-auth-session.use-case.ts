import { Injectable } from '@nestjs/common'

import type {
  AuthTokens,
  RefreshTokenResponse,
  SessionUser,
  SignInResponse,
} from '@postsop/contracts/auth'

import { AppException } from '@/common/exceptions/app.exception'
import { UserAuthQueryService } from '@/modules/user/queries/user-auth.query.service'

import type { AuthSession } from '../interfaces/auth-session.interface'
import type { JwtPayload } from '../interfaces/jwt-payload.interface'
import { AccessTokenService } from '../services/access-token.service'
import { RefreshSessionService } from '../services/refresh-session.service'

@Injectable()
export class RefreshAuthSessionUseCase {
  constructor(
    private readonly userAuthQueryService: UserAuthQueryService,
    private readonly refreshSessionService: RefreshSessionService,
    private readonly accessTokenService: AccessTokenService,
  ) {}

  async execute(refreshToken: string): Promise<RefreshTokenResponse> {
    const session = await this.refreshSessionService.rotateSession(refreshToken)
    const user = await this.userAuthQueryService.findSessionUserById(
      session.userId,
    )

    if (!user) {
      await this.refreshSessionService.invalidateSession(session.sessionId)
      throw AppException.tokenInvalid('Refresh token user no longer exists')
    }

    return this.createAuthResponse(session, user)
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
