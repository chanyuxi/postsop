import { Injectable } from '@nestjs/common'

import {
  encodePermissionMask,
  permissionRegistryVersion,
} from '@postsop/access-control'
import type { AuthTokens, RefreshTokenResponse } from '@postsop/contracts/auth'

import { AppException } from '@/common/exceptions/app.exception'
import { UserStatus } from '@/generated/prisma/enums'
import { PermissionService } from '@/modules/permission/services/permission.service'
import { UserAuthQueryService } from '@/modules/user/queries/user-auth.query.service'

import type { AuthSession } from '../interfaces/auth-session.interface'
import type { AuthContextPayload } from '../interfaces/claims.interface'
import { AccessTokenService } from '../services/access-token.service'
import { SessionService } from '../services/session.service'

@Injectable()
export class RefreshAuthSessionUseCase {
  constructor(
    private readonly userAuthQueryService: UserAuthQueryService,
    private readonly sessionService: SessionService,
    private readonly accessTokenService: AccessTokenService,
    private readonly permissionService: PermissionService,
  ) {}

  async execute(refreshToken: string): Promise<RefreshTokenResponse> {
    const session = await this.sessionService.rotateSession(refreshToken)
    const userStatus =
      await this.userAuthQueryService.findUserStatusForSessionById(
        session.userId,
      )

    if (userStatus !== UserStatus.ACTIVE) {
      await this.sessionService.invalidateSession(session.sessionId)
      throw AppException.tokenInvalid(
        userStatus
          ? 'Refresh token user is no longer active'
          : 'Refresh token user no longer exists',
      )
    }

    return this.createAuthResponse(session)
  }

  private async createAuthResponse(
    session: AuthSession,
  ): Promise<RefreshTokenResponse> {
    const tokens = await this.issueTokenPair(session)

    return {
      tokens,
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
