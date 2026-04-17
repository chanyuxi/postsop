import { Injectable } from '@nestjs/common'

import {
  encodePermissionMask,
  permissionRegistryVersion,
} from '@postsop/access-control'
import type {
  AuthTokens,
  SignInRequest,
  SignInResponse,
} from '@postsop/contracts/auth'

import { AppException } from '@/common/exceptions/app.exception'
import { verifyPassword } from '@/common/utils/password.util'
import { UserStatus } from '@/generated/prisma/enums'
import { PermissionService } from '@/modules/permission/services/permission.service'
import { UserAuthQueryService } from '@/modules/user/queries/user-auth.query.service'

import type { AuthSession } from '../interfaces/auth-session.interface'
import type { AuthContextPayload } from '../interfaces/claims.interface'
import { AccessTokenService } from '../services/access-token.service'
import { SessionService } from '../services/session.service'

@Injectable()
export class SignInUseCase {
  constructor(
    private readonly userAuthQueryService: UserAuthQueryService,
    private readonly sessionService: SessionService,
    private readonly accessTokenService: AccessTokenService,
    private readonly permissionService: PermissionService,
  ) {}

  async execute(signInRequest: SignInRequest): Promise<SignInResponse> {
    const { email, password } = signInRequest

    const user = await this.userAuthQueryService.findUserForSignInByEmail(email)

    if (user === null || !(await verifyPassword(password, user.password))) {
      throw AppException.unauthorized('Invalid email or password')
    }
    if (user.status !== UserStatus.ACTIVE) {
      throw AppException.unauthorized('User account is not active')
    }

    const session = await this.sessionService.createSession(user.id)

    return this.createAuthResponse(session)
  }

  private async createAuthResponse(
    session: AuthSession,
  ): Promise<SignInResponse> {
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
