import { InternalStatusCodes } from '@postsop/contracts/http'

import { AppException } from '@/common/exceptions/app.exception'
import { hashPassword } from '@/common/utils/password.util'
import type { UserService } from '@/modules/user/services/user.service'

import { AuthService } from './auth.service'
import type { TokenService } from './token.service'

jest.mock('@/modules/user/services/user.service', () => ({
  UserService: class UserService {},
}))

describe('AuthService', () => {
  let authService: AuthService

  const userService = {
    createUser: jest.fn(),
    findSessionUserById: jest.fn(),
    findUserForSignInByEmail: jest.fn(),
  } as unknown as UserService

  const tokenService = {
    createSession: jest.fn(),
    generateAccessToken: jest.fn(),
    invalidateSession: jest.fn(),
    rotateSession: jest.fn(),
  } as unknown as TokenService

  beforeEach(() => {
    jest.clearAllMocks()
    authService = new AuthService(userService, tokenService)
  })

  it('signs in successfully when the stored password is hashed', async () => {
    const passwordHash = await hashPassword('password')
    const findUserForSignInByEmail = jest.fn().mockResolvedValue({
      email: 'admin@example.com',
      id: 1,
      password: passwordHash,
      roles: [{ name: 'admin' }],
      status: 'ACTIVE',
    })
    const createSession = jest.fn().mockResolvedValue({
      refreshToken: 'refresh-token',
      sessionId: 'session-1',
      userId: 1,
    })
    const generateAccessToken = jest.fn().mockResolvedValue('access-token')

    userService.findUserForSignInByEmail = findUserForSignInByEmail
    tokenService.createSession = createSession
    tokenService.generateAccessToken = generateAccessToken

    const result = await authService.signIn({
      email: 'admin@example.com',
      password: 'password',
    })

    expect(generateAccessToken).toHaveBeenCalledWith({
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

  it('invalidates refresh sessions when the user no longer exists', async () => {
    const rotateSession = jest.fn().mockResolvedValue({
      refreshToken: 'refresh-token-2',
      sessionId: 'session-1',
      userId: 1,
    })
    const findSessionUserById = jest.fn().mockResolvedValue(null)
    const invalidateSession = jest.fn().mockResolvedValue(undefined)

    tokenService.rotateSession = rotateSession
    userService.findSessionUserById = findSessionUserById
    tokenService.invalidateSession = invalidateSession

    const refreshAttempt = authService.refreshToken('refresh-token-1')

    await expect(refreshAttempt).rejects.toBeInstanceOf(AppException)
    await expect(refreshAttempt).rejects.toMatchObject({
      internalCode: InternalStatusCodes.TOKEN_INVALID,
    })
    expect(invalidateSession).toHaveBeenCalledWith('session-1')
  })

  it('refreshes auth sessions with the latest user snapshot', async () => {
    const rotateSession = jest.fn().mockResolvedValue({
      refreshToken: 'refresh-token-2',
      sessionId: 'session-1',
      userId: 1,
    })
    const findSessionUserById = jest.fn().mockResolvedValue({
      email: 'admin@example.com',
      id: 1,
      roles: [{ name: 'admin' }],
    })
    const generateAccessToken = jest.fn().mockResolvedValue('access-token-2')

    tokenService.rotateSession = rotateSession
    userService.findSessionUserById = findSessionUserById
    tokenService.generateAccessToken = generateAccessToken

    const result = await authService.refreshToken('refresh-token-1')

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
