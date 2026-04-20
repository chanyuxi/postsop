import { Injectable } from '@nestjs/common'
import assert from 'node:assert/strict'

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
import { SignInUserRecord } from '@/modules/user/selectors/auth-user.select'

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
    const user = await this.userAuthQueryService.findUserForSignInByEmail(
      signInRequest.email,
    )
    this.checkIsUserExist(user)
    assert.ok(user)
    this.checkIsUserAccessible(user, signInRequest.password)

    const session = await this.sessionService.createSession(user.id)
    return this.createAuthResponse(session)
  }

  /**
   * TODO: add comment
   */
  private checkIsUserExist(user: SignInUserRecord | null) {
    if (!user) {
      throw AppException.unauthorized('User does not exist')
    }
  }

  /**
   * TODO: add comment
   */
  private async checkIsUserAccessible(
    user: SignInUserRecord,
    password: string,
  ) {
    if (!(await verifyPassword(password, user.password))) {
      throw AppException.unauthorized('Invalid email or password')
    }

    if (user.status !== UserStatus.ACTIVE) {
      throw AppException.unauthorized('User account is not active')
    }
  }

  /**
   * TODO: add comment
   */
  private async createAuthResponse(
    session: AuthSession,
  ): Promise<SignInResponse> {
    const tokens = await this.issueTokenPair(session)

    return {
      tokens,
    }
  }

  /**
   * TODO: add comment
   */
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
