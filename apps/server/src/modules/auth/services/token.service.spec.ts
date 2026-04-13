import type { Cache } from '@nestjs/cache-manager'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'

import { InternalStatusCodes } from '@postsop/contracts/http'

import { ENV_CONSTANTS } from '@/common/constants/env'
import { AppException } from '@/common/exceptions/app.exception'

import { TokenService } from './token.service'

describe('TokenService', () => {
  const cacheStore = new Map<string, unknown>()
  const cacheManager = {
    del: jest.fn((key: string) => {
      cacheStore.delete(key)
      return Promise.resolve()
    }),
    get: jest.fn((key: string) => Promise.resolve(cacheStore.get(key))),
    set: jest.fn((key: string, value: unknown) => {
      cacheStore.set(key, value)
      return Promise.resolve()
    }),
  } as unknown as Cache

  const configService = {
    getOrThrow: jest.fn((key: string) => {
      if (key === ENV_CONSTANTS.REFRESH_TOKEN_EXPIRATION_TIME) {
        return '60000'
      }

      throw new Error(`Unexpected config key: ${key}`)
    }),
  }

  const jwtService = {
    signAsync: jest.fn((payload: object) =>
      Promise.resolve(JSON.stringify(payload)),
    ),
    verifyAsync: jest.fn((token: string) => {
      const payload = JSON.parse(token) as object
      return Promise.resolve(payload)
    }),
  }

  let service: TokenService

  beforeEach(async () => {
    cacheStore.clear()
    jest.clearAllMocks()

    const moduleRef = await Test.createTestingModule({
      providers: [
        TokenService,
        {
          provide: ConfigService,
          useValue: configService,
        },
        {
          provide: JwtService,
          useValue: jwtService,
        },
        {
          provide: CACHE_MANAGER,
          useValue: cacheManager,
        },
      ],
    }).compile()

    service = moduleRef.get(TokenService)
  })

  it('creates a session with a hashed refresh token record', async () => {
    const session = await service.createSession(42)

    expect(session.sessionId).toBeTruthy()
    expect(session.refreshToken).toContain('.')
    expect(session.userId).toBe(42)

    const cacheEntry = cacheStore.get(`session:${session.sessionId}`) as {
      refreshTokenHash: string
      userId: number
    }

    expect(cacheEntry.userId).toBe(42)
    expect(cacheEntry.refreshTokenHash).toHaveLength(64)
    expect(cacheEntry.refreshTokenHash).not.toContain(
      session.refreshToken.split('.')[1],
    )
  })

  it('rotates session refresh tokens and invalidates the previous token value', async () => {
    const initialSession = await service.createSession(42)
    const rotatedSession = await service.rotateSession(
      initialSession.refreshToken,
    )

    expect(rotatedSession.userId).toBe(42)
    expect(rotatedSession.sessionId).toBe(initialSession.sessionId)
    expect(rotatedSession.refreshToken).not.toBe(initialSession.refreshToken)

    const invalidRotation = service.rotateSession(initialSession.refreshToken)

    await expect(invalidRotation).rejects.toBeInstanceOf(AppException)
    await expect(invalidRotation).rejects.toMatchObject({
      internalCode: InternalStatusCodes.TOKEN_INVALID,
    })
  })

  it('invalidates sessions by session id', async () => {
    const session = await service.createSession(42)

    await service.invalidateSession(session.sessionId)

    expect(cacheStore.has(`session:${session.sessionId}`)).toBe(false)
  })
})
