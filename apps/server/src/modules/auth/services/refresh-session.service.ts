import type { Cache } from '@nestjs/cache-manager'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Inject, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { createHash, randomBytes, timingSafeEqual } from 'node:crypto'

import { envs } from '@/common/constants/env'
import { AppException } from '@/common/exceptions/app.exception'

import type { AuthSession } from '../interfaces/auth-session.interface'

interface SessionState {
  refreshTokenHash: string
  userId: number
}

@Injectable()
export class RefreshSessionService {
  private static readonly SESSION_PREFIX = 'session:'
  private readonly refreshTokenTtl: number

  constructor(
    private readonly configService: ConfigService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {
    this.refreshTokenTtl = this.getPositiveNumberConfig(
      envs.REFRESH_TOKEN_EXPIRATION_TIME,
    )
  }

  async createSession(userId: number): Promise<AuthSession> {
    const sessionId = this.createOpaqueTokenPart(18)
    const secret = this.createOpaqueTokenPart()
    const refreshToken = this.composeRefreshToken(sessionId, secret)

    await this.cacheManager.set(
      this.getSessionKey(sessionId),
      {
        refreshTokenHash: this.hashValue(secret),
        userId,
      } satisfies SessionState,
      this.refreshTokenTtl,
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
      !this.compareHashes(session.refreshTokenHash, this.hashValue(secret))
    ) {
      throw AppException.tokenInvalid('Invalid refresh token')
    }

    const nextSecret = this.createOpaqueTokenPart()
    const nextRefreshToken = this.composeRefreshToken(sessionId, nextSecret)

    await this.cacheManager.set(
      this.getSessionKey(sessionId),
      {
        refreshTokenHash: this.hashValue(nextSecret),
        userId: session.userId,
      } satisfies SessionState,
      this.refreshTokenTtl,
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

  private getPositiveNumberConfig(key: string): number {
    const rawValue = this.configService.getOrThrow<string>(key)
    const parsedValue = Number(rawValue)

    if (!Number.isFinite(parsedValue) || parsedValue <= 0) {
      throw new Error(`${key} must be a positive integer in milliseconds`)
    }

    return parsedValue
  }

  private getSessionKey(sessionId: string): string {
    return `${RefreshSessionService.SESSION_PREFIX}${sessionId}`
  }

  private createOpaqueTokenPart(byteLength = 32): string {
    return randomBytes(byteLength).toString('base64url')
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

  private hashValue(value: string): string {
    return createHash('sha256').update(value).digest('hex')
  }

  private compareHashes(left: string, right: string): boolean {
    const leftBuffer = Buffer.from(left, 'hex')
    const rightBuffer = Buffer.from(right, 'hex')

    if (leftBuffer.length !== rightBuffer.length) {
      return false
    }

    return timingSafeEqual(leftBuffer, rightBuffer)
  }
}
