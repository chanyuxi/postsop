import type { ExecutionContext } from '@nestjs/common'
import type { Reflector } from '@nestjs/core'
import { TokenExpiredError } from '@nestjs/jwt'

import { Codes } from '@postsop/contracts/http'

import { AppException } from '@/common/exceptions/app.exception'
import { AuthGuard } from '@/common/guards/auth.guard'
import type { AuthContextPayload } from '@/modules/auth/interfaces/claims.interface'
import type { AccessTokenService } from '@/modules/auth/services/access-token.service'

describe('AuthGuard', () => {
  const createContext = (authorization?: string) => {
    const request = {
      authContext: undefined as AuthContextPayload | undefined,
      headers: authorization ? { authorization } : {},
    }

    const context = {
      getClass: jest.fn(),
      getHandler: jest.fn(),
      switchToHttp: () => ({
        getRequest: () => request,
      }),
    } as unknown as ExecutionContext

    return {
      context,
      request,
    }
  }

  const accessTokenService = {
    verifyAccessToken: jest.fn(),
  } as unknown as AccessTokenService

  const reflector = {
    getAllAndOverride: jest.fn(),
  } as unknown as Reflector

  let guard: AuthGuard

  beforeEach(() => {
    jest.clearAllMocks()
    guard = new AuthGuard(accessTokenService, reflector)
  })

  it('allows public routes without checking the token', async () => {
    ;(reflector.getAllAndOverride as jest.Mock).mockReturnValue(true)

    const { context } = createContext()

    await expect(guard.canActivate(context)).resolves.toBe(true)
    expect(accessTokenService.verifyAccessToken).not.toHaveBeenCalled()
  })

  it('rejects requests without a bearer token', async () => {
    ;(reflector.getAllAndOverride as jest.Mock).mockReturnValue(false)

    const { context } = createContext()
    const authorizationCheck = guard.canActivate(context)

    await expect(authorizationCheck).rejects.toBeInstanceOf(AppException)
    await expect(authorizationCheck).rejects.toMatchObject({
      code: Codes.UNAUTHORIZED,
    })
  })

  it('attaches the verified auth context to the request', async () => {
    ;(reflector.getAllAndOverride as jest.Mock).mockReturnValue(false)
    ;(accessTokenService.verifyAccessToken as jest.Mock).mockResolvedValue({
      pm: '11',
      pv: 1,
      sid: 'session-1',
      sub: 1,
    })

    const { context, request } = createContext('Bearer access-token')

    await expect(guard.canActivate(context)).resolves.toBe(true)
    expect(accessTokenService.verifyAccessToken).toHaveBeenCalledWith(
      'access-token',
    )
    expect(request.authContext).toEqual({
      pm: '11',
      pv: 1,
      sid: 'session-1',
      sub: 1,
    })
  })

  it('maps expired access tokens to TOKEN_EXPIRED with a generic message', async () => {
    ;(reflector.getAllAndOverride as jest.Mock).mockReturnValue(false)
    ;(accessTokenService.verifyAccessToken as jest.Mock).mockRejectedValue(
      new TokenExpiredError('jwt expired', new Date()),
    )

    const { context } = createContext('Bearer access-token')
    const authorizationCheck = guard.canActivate(context)

    await expect(authorizationCheck).rejects.toBeInstanceOf(AppException)
    await expect(authorizationCheck).rejects.toMatchObject({
      code: Codes.TOKEN_EXPIRED,
      message: 'Invalid authorization token',
    })
  })

  it('maps unexpected token failures to TOKEN_INVALID', async () => {
    ;(reflector.getAllAndOverride as jest.Mock).mockReturnValue(false)
    ;(accessTokenService.verifyAccessToken as jest.Mock).mockRejectedValue(
      new Error('broken token'),
    )

    const { context } = createContext('Bearer access-token')
    const authorizationCheck = guard.canActivate(context)

    await expect(authorizationCheck).rejects.toBeInstanceOf(AppException)
    await expect(authorizationCheck).rejects.toMatchObject({
      code: Codes.TOKEN_INVALID,
      message: 'Invalid authorization token',
    })
  })
})
