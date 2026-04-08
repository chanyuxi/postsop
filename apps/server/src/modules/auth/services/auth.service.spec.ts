import { UnauthorizedException } from '@nestjs/common'

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
    findAuthUserByEmail: jest.fn(),
    findUserById: jest.fn(),
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
    const findAuthUserByEmail = jest.fn().mockResolvedValue({
      email: 'admin@example.com',
      id: 1,
      password: passwordHash,
      roles: [{ name: 'admin' }],
    })
    const createSession = jest.fn().mockResolvedValue({
      refreshToken: 'refresh-token',
      sessionId: 'session-1',
      userId: 1,
    })
    const generateAccessToken = jest.fn().mockResolvedValue('access-token')

    userService.findAuthUserByEmail = findAuthUserByEmail
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
    const findUserById = jest.fn().mockResolvedValue(null)
    const invalidateSession = jest.fn().mockResolvedValue(undefined)

    tokenService.rotateSession = rotateSession
    userService.findUserById = findUserById
    tokenService.invalidateSession = invalidateSession

    await expect(authService.refreshToken('refresh-token-1')).rejects.toThrow(
      UnauthorizedException,
    )
    expect(invalidateSession).toHaveBeenCalledWith('session-1')
  })
})
