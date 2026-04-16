import {
  encodePermissionMask,
  permissionRegistryVersion,
} from '@postsop/access-control'
import { Codes } from '@postsop/contracts/http'

import { AppException } from '@/common/exceptions/app.exception'
import { hashPassword } from '@/common/utils/password.util'
import { UserStatus } from '@/generated/prisma/enums'
import type { AccessTokenService } from '@/modules/auth/services/access-token.service'
import type { SessionService } from '@/modules/auth/services/session.service'
import { SignInUseCase } from '@/modules/auth/use-cases/sign-in.use-case'
import type { PermissionService } from '@/modules/permission/services/permission.service'
import type { UserAuthQueryService } from '@/modules/user/queries/user-auth.query.service'

jest.mock('@/modules/user/queries/user-auth.query.service', () => ({
  UserAuthQueryService: class UserAuthQueryService {},
}))

jest.mock('@/modules/permission/services/permission.service', () => ({
  PermissionService: class PermissionService {},
}))

describe('SignInUseCase', () => {
  const userAuthQueryService = {
    findUserForSignInByEmail: jest.fn(),
  } as unknown as UserAuthQueryService

  const sessionService = {
    createSession: jest.fn(),
  } as unknown as SessionService

  const accessTokenService = {
    generateAccessToken: jest.fn(),
  } as unknown as AccessTokenService

  const permissionService = {
    getUserPermissionNames: jest.fn(),
  } as unknown as PermissionService

  let useCase: SignInUseCase

  beforeEach(() => {
    jest.clearAllMocks()
    useCase = new SignInUseCase(
      userAuthQueryService,
      sessionService,
      accessTokenService,
      permissionService,
    )
  })

  it('signs in successfully when the stored password is hashed', async () => {
    const passwordHash = await hashPassword('password')

    userAuthQueryService.findUserForSignInByEmail = jest
      .fn()
      .mockResolvedValue({
        id: 1,
        password: passwordHash,
        status: 'ACTIVE',
      })
    sessionService.createSession = jest.fn().mockResolvedValue({
      refreshToken: 'refresh-token',
      sessionId: 'session-1',
      userId: 1,
    })
    permissionService.getUserPermissionNames = jest
      .fn()
      .mockResolvedValue(['create:user', 'read:user'])
    accessTokenService.generateAccessToken = jest
      .fn()
      .mockResolvedValue('access-token')

    const result = await useCase.execute({
      email: 'admin@example.com',
      password: 'password',
    })

    expect(accessTokenService.generateAccessToken).toHaveBeenCalledWith({
      pm: encodePermissionMask(['create:user', 'read:user']),
      pv: permissionRegistryVersion,
      sid: 'session-1',
      sub: 1,
    })
    expect(result).toEqual({
      tokens: {
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      },
    })
  })

  it('rejects invalid credentials', async () => {
    userAuthQueryService.findUserForSignInByEmail = jest
      .fn()
      .mockResolvedValue(null)

    const attempt = useCase.execute({
      email: 'admin@example.com',
      password: 'password',
    })

    await expect(attempt).rejects.toBeInstanceOf(AppException)
    await expect(attempt).rejects.toMatchObject({
      code: Codes.UNAUTHORIZED,
    })
  })

  it('rejects users whose account is not active', async () => {
    const passwordHash = await hashPassword('password')

    userAuthQueryService.findUserForSignInByEmail = jest
      .fn()
      .mockResolvedValue({
        id: 1,
        password: passwordHash,
        status: UserStatus.LOCKED,
      })

    const attempt = useCase.execute({
      email: 'admin@example.com',
      password: 'password',
    })

    await expect(attempt).rejects.toBeInstanceOf(AppException)
    await expect(attempt).rejects.toMatchObject({
      code: Codes.UNAUTHORIZED,
      message: 'User account is not active',
    })
    expect(sessionService.createSession).not.toHaveBeenCalled()
  })
})
