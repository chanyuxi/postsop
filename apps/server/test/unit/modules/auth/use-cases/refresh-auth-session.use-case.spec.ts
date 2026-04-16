import {
  encodePermissionMask,
  permissionRegistryVersion,
} from '@postsop/access-control'
import { Codes } from '@postsop/contracts/http'

import { AppException } from '@/common/exceptions/app.exception'
import { UserStatus } from '@/generated/prisma/enums'
import type { AccessTokenService } from '@/modules/auth/services/access-token.service'
import type { SessionService } from '@/modules/auth/services/session.service'
import { RefreshAuthSessionUseCase } from '@/modules/auth/use-cases/refresh-auth-session.use-case'
import type { PermissionService } from '@/modules/permission/services/permission.service'
import type { UserAuthQueryService } from '@/modules/user/queries/user-auth.query.service'

jest.mock('@/modules/user/queries/user-auth.query.service', () => ({
  UserAuthQueryService: class UserAuthQueryService {},
}))

jest.mock('@/modules/permission/services/permission.service', () => ({
  PermissionService: class PermissionService {},
}))

describe('RefreshAuthSessionUseCase', () => {
  const userAuthQueryService = {
    findUserStatusForSessionById: jest.fn(),
  } as unknown as UserAuthQueryService

  const sessionService = {
    invalidateSession: jest.fn(),
    rotateSession: jest.fn(),
  } as unknown as SessionService

  const accessTokenService = {
    generateAccessToken: jest.fn(),
  } as unknown as AccessTokenService

  const permissionService = {
    getUserPermissionNames: jest.fn(),
  } as unknown as PermissionService

  let useCase: RefreshAuthSessionUseCase

  beforeEach(() => {
    jest.clearAllMocks()
    useCase = new RefreshAuthSessionUseCase(
      userAuthQueryService,
      sessionService,
      accessTokenService,
      permissionService,
    )
  })

  it('invalidates refresh sessions when the user no longer exists', async () => {
    sessionService.rotateSession = jest.fn().mockResolvedValue({
      refreshToken: 'refresh-token-2',
      sessionId: 'session-1',
      userId: 1,
    })
    userAuthQueryService.findUserStatusForSessionById = jest
      .fn()
      .mockResolvedValue(null)
    sessionService.invalidateSession = jest.fn().mockResolvedValue(undefined)

    const refreshAttempt = useCase.execute('refresh-token-1')

    await expect(refreshAttempt).rejects.toBeInstanceOf(AppException)
    await expect(refreshAttempt).rejects.toMatchObject({
      code: Codes.TOKEN_INVALID,
    })
    expect(sessionService.invalidateSession).toHaveBeenCalledWith('session-1')
  })

  it('invalidates refresh sessions when the user is no longer active', async () => {
    sessionService.rotateSession = jest.fn().mockResolvedValue({
      refreshToken: 'refresh-token-2',
      sessionId: 'session-1',
      userId: 1,
    })
    userAuthQueryService.findUserStatusForSessionById = jest
      .fn()
      .mockResolvedValue(UserStatus.DISABLED)
    sessionService.invalidateSession = jest.fn().mockResolvedValue(undefined)

    const refreshAttempt = useCase.execute('refresh-token-1')

    await expect(refreshAttempt).rejects.toBeInstanceOf(AppException)
    await expect(refreshAttempt).rejects.toMatchObject({
      code: Codes.TOKEN_INVALID,
    })
    expect(sessionService.invalidateSession).toHaveBeenCalledWith('session-1')
  })

  it('refreshes auth sessions without returning a user snapshot', async () => {
    sessionService.rotateSession = jest.fn().mockResolvedValue({
      refreshToken: 'refresh-token-2',
      sessionId: 'session-1',
      userId: 1,
    })
    userAuthQueryService.findUserStatusForSessionById = jest
      .fn()
      .mockResolvedValue(UserStatus.ACTIVE)
    permissionService.getUserPermissionNames = jest
      .fn()
      .mockResolvedValue(['read:user', 'update:user'])
    accessTokenService.generateAccessToken = jest
      .fn()
      .mockResolvedValue('access-token-2')

    const result = await useCase.execute('refresh-token-1')

    expect(accessTokenService.generateAccessToken).toHaveBeenCalledWith({
      pm: encodePermissionMask(['read:user', 'update:user']),
      pv: permissionRegistryVersion,
      sid: 'session-1',
      sub: 1,
    })
    expect(result).toEqual({
      tokens: {
        accessToken: 'access-token-2',
        refreshToken: 'refresh-token-2',
      },
    })
  })
})
