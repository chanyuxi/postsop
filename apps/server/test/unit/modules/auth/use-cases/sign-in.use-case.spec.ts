import { InternalStatusCodes } from '@postsop/contracts/http'

import { AppException } from '@/common/exceptions/app.exception'
import { hashPassword } from '@/common/utils/password.util'
import type { AccessTokenService } from '@/modules/auth/services/access-token.service'
import type { RefreshSessionService } from '@/modules/auth/services/refresh-session.service'
import { SignInUseCase } from '@/modules/auth/use-cases/sign-in.use-case'
import type { UserAuthQueryService } from '@/modules/user/queries/user-auth.query.service'

jest.mock('@/modules/user/queries/user-auth.query.service', () => ({
  UserAuthQueryService: class UserAuthQueryService {},
}))

describe('SignInUseCase', () => {
  const userAuthQueryService = {
    findUserForSignInByEmail: jest.fn(),
  } as unknown as UserAuthQueryService

  const refreshSessionService = {
    createSession: jest.fn(),
  } as unknown as RefreshSessionService

  const accessTokenService = {
    generateAccessToken: jest.fn(),
  } as unknown as AccessTokenService

  let useCase: SignInUseCase

  beforeEach(() => {
    jest.clearAllMocks()
    useCase = new SignInUseCase(
      userAuthQueryService,
      refreshSessionService,
      accessTokenService,
    )
  })

  it('signs in successfully when the stored password is hashed', async () => {
    const passwordHash = await hashPassword('password')

    userAuthQueryService.findUserForSignInByEmail = jest
      .fn()
      .mockResolvedValue({
        email: 'admin@example.com',
        id: 1,
        password: passwordHash,
        roles: [{ name: 'admin' }],
        sessionUser: {
          email: 'admin@example.com',
          id: 1,
          roles: [{ name: 'admin' }],
        },
        status: 'ACTIVE',
      })
    refreshSessionService.createSession = jest.fn().mockResolvedValue({
      refreshToken: 'refresh-token',
      sessionId: 'session-1',
      userId: 1,
    })
    accessTokenService.generateAccessToken = jest
      .fn()
      .mockResolvedValue('access-token')

    const result = await useCase.execute({
      email: 'admin@example.com',
      password: 'password',
    })

    expect(accessTokenService.generateAccessToken).toHaveBeenCalledWith({
      sessionId: 'session-1',
      user: {
        id: 1,
      },
    })
    expect(result).toEqual({
      tokens: {
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      },
      user: {
        email: 'admin@example.com',
        id: 1,
        roles: [{ name: 'admin' }],
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
      internalCode: InternalStatusCodes.UNAUTHORIZED,
    })
  })
})
