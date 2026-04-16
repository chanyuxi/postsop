import { Injectable } from '@nestjs/common'

import {
  encodePermissionMask,
  permissionRegistryVersion,
} from '@postsop/access-control'
import type {
  AuthTokens,
  RefreshTokenResponse,
  SessionUser,
  SignInResponse,
} from '@postsop/contracts/auth'

import { AppException } from '@/common/exceptions/app.exception'
import { PermissionService } from '@/modules/permission/services/permission.service'
import { UserAuthQueryService } from '@/modules/user/queries/user-auth.query.service'

import type { AuthSession } from '../interfaces/auth-session.interface'
import type { AuthContextPayload } from '../interfaces/claims.interface'
import { AccessTokenService } from '../services/access-token.service'
import { RefreshSessionService } from '../services/refresh-session.service'

@Injectable()
export class RefreshAuthSessionUseCase {
  constructor(
    private readonly userAuthQueryService: UserAuthQueryService,
    private readonly refreshSessionService: RefreshSessionService,
    private readonly accessTokenService: AccessTokenService,
    private readonly permissionService: PermissionService,
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
    const permissions = await this.permissionService.getUserPermissionNames(
      session.userId,
    )
    const authContext: AuthContextPayload = {
      pm: encodePermissionMask(permissions),
      pv: permissionRegistryVersion,
      sid: session.sessionId,
      sub: session.userId,
    }

    const accessToken =
      await this.accessTokenService.generateAccessToken(authContext)

    return {
      accessToken,
      refreshToken: session.refreshToken,
    }
  }
}
