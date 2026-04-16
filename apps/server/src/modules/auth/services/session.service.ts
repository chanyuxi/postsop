import type { Cache } from '@nestjs/cache-manager'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Inject, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { envs } from '@/common/constants/env'
import { AppException } from '@/common/exceptions/app.exception'
import { getPositiveNumberConfig } from '@/common/utils/config.util'
import {
  createOpaqueToken,
  hashSha256,
  timingSafeEqualHex,
} from '@/common/utils/crypto.util'

import type { AuthSession } from '../interfaces/auth-session.interface'

interface SessionState {
  secretHash: string
  userId: number
}

@Injectable()
export class SessionService {
  private static readonly SESSION_PREFIX = 'session:'
  private readonly ttl: number

  constructor(
    private readonly configService: ConfigService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {
    this.ttl = getPositiveNumberConfig(
      this.configService,
      envs.REFRESH_TOKEN_EXPIRATION_TIME,
    )
  }

  async createSession(userId: number): Promise<AuthSession> {
    const sessionId = createOpaqueToken(18)
    const secret = createOpaqueToken()
    const refreshToken = this.composeRefreshToken(sessionId, secret)

    await this.cacheManager.set(
      this.getSessionKey(sessionId),
      {
        secretHash: hashSha256(secret),
        userId,
      } satisfies SessionState,
      this.ttl,
    )

    return {
      refreshToken,
      sessionId,
      userId,
    }
  }

  async rotateSession(refreshToken: string): Promise<AuthSession> {
    const { secret, sessionId } = this.parseRefreshToken(refreshToken)
    const session = await this.cacheManager.get<SessionState>(
      this.getSessionKey(sessionId),
    )

    if (
      !session ||
      !timingSafeEqualHex(session.secretHash, hashSha256(secret))
    ) {
      throw AppException.tokenInvalid('Invalid refresh token')
    }

    const nextSecret = createOpaqueToken()
    const nextRefreshToken = this.composeRefreshToken(sessionId, nextSecret)

    await this.cacheManager.set(
      this.getSessionKey(sessionId),
      {
        secretHash: hashSha256(nextSecret),
        userId: session.userId,
      } satisfies SessionState,
      this.ttl,
    )

    return {
      refreshToken: nextRefreshToken,
      sessionId,
      userId: session.userId,
    }
  }

  async invalidateSession(sessionId: string) {
    await this.cacheManager.del(this.getSessionKey(sessionId))
  }

  private getSessionKey(sessionId: string): string {
    return `${SessionService.SESSION_PREFIX}${sessionId}`
  }

  private composeRefreshToken(sessionId: string, secret: string): string {
    return `${sessionId}.${secret}`
  }

  private parseRefreshToken(refreshToken: string) {
    const [sessionId, secret] = refreshToken.split('.')

    if (!sessionId || !secret) {
      throw AppException.tokenInvalid('Invalid refresh token')
    }

    return {
      secret,
      sessionId,
    }
  }
}
