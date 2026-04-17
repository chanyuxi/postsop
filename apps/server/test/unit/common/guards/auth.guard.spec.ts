import type { ExecutionContext } from '@nestjs/common'
import type { Reflector } from '@nestjs/core'

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
    verifyAccessTokenSafelyThrownOut: jest.fn(),
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
    expect(
      accessTokenService.verifyAccessTokenSafelyThrownOut,
    ).not.toHaveBeenCalled()
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
    ;(
      accessTokenService.verifyAccessTokenSafelyThrownOut as jest.Mock
    ).mockResolvedValue({
      pm: '11',
      pv: 1,
      sid: 'session-1',
      sub: 1,
    })

    const { context, request } = createContext('Bearer access-token')

    await expect(guard.canActivate(context)).resolves.toBe(true)
    expect(
      accessTokenService.verifyAccessTokenSafelyThrownOut,
    ).toHaveBeenCalledWith('access-token')
    expect(request.authContext).toEqual({
      pm: '11',
      pv: 1,
      sid: 'session-1',
      sub: 1,
    })
  })

  it('rethrows token validation failures from AccessTokenService', async () => {
    ;(reflector.getAllAndOverride as jest.Mock).mockReturnValue(false)
    ;(
      accessTokenService.verifyAccessTokenSafelyThrownOut as jest.Mock
    ).mockRejectedValue(
      AppException.tokenInvalid('Invalid authorization token'),
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
