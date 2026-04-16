import { InternalStatusCodes } from '@postsop/contracts/http'

import { AppException } from '@/common/exceptions/app.exception'
import type { AccessTokenService } from '@/modules/auth/services/access-token.service'
import type { RefreshSessionService } from '@/modules/auth/services/refresh-session.service'
import { RefreshAuthSessionUseCase } from '@/modules/auth/use-cases/refresh-auth-session.use-case'
import type { UserAuthQueryService } from '@/modules/user/queries/user-auth.query.service'

jest.mock('@/modules/user/queries/user-auth.query.service', () => ({
  UserAuthQueryService: class UserAuthQueryService {},
}))

describe('RefreshAuthSessionUseCase', () => {
  const userAuthQueryService = {
    findSessionUserById: jest.fn(),
  } as unknown as UserAuthQueryService

  const refreshSessionService = {
    invalidateSession: jest.fn(),
    rotateSession: jest.fn(),
  } as unknown as RefreshSessionService

  const accessTokenService = {
    generateAccessToken: jest.fn(),
  } as unknown as AccessTokenService

  let useCase: RefreshAuthSessionUseCase

  beforeEach(() => {
    jest.clearAllMocks()
    useCase = new RefreshAuthSessionUseCase(
      userAuthQueryService,
      refreshSessionService,
      accessTokenService,
    )
  })

  it('invalidates refresh sessions when the user no longer exists', async () => {
    refreshSessionService.rotateSession = jest.fn().mockResolvedValue({
      refreshToken: 'refresh-token-2',
      sessionId: 'session-1',
      userId: 1,
    })
    userAuthQueryService.findSessionUserById = jest.fn().mockResolvedValue(null)
    refreshSessionService.invalidateSession = jest
      .fn()
      .mockResolvedValue(undefined)

    const refreshAttempt = useCase.execute('refresh-token-1')

    await expect(refreshAttempt).rejects.toBeInstanceOf(AppException)
    await expect(refreshAttempt).rejects.toMatchObject({
      internalCode: InternalStatusCodes.TOKEN_INVALID,
    })
    expect(refreshSessionService.invalidateSession).toHaveBeenCalledWith(
      'session-1',
    )
  })

  it('refreshes auth sessions with the latest user snapshot', async () => {
    refreshSessionService.rotateSession = jest.fn().mockResolvedValue({
      refreshToken: 'refresh-token-2',
      sessionId: 'session-1',
      userId: 1,
    })
    userAuthQueryService.findSessionUserById = jest.fn().mockResolvedValue({
      email: 'admin@example.com',
      id: 1,
      roles: [{ name: 'admin' }],
    })
    accessTokenService.generateAccessToken = jest
      .fn()
      .mockResolvedValue('access-token-2')

    const result = await useCase.execute('refresh-token-1')

    expect(accessTokenService.generateAccessToken).toHaveBeenCalledWith({
      sid: 'session-1',
      sub: 1,
    })
    expect(result).toEqual({
      tokens: {
        accessToken: 'access-token-2',
        refreshToken: 'refresh-token-2',
      },
      user: {
        email: 'admin@example.com',
        id: 1,
        roles: [{ name: 'admin' }],
      },
    })
  })
})
