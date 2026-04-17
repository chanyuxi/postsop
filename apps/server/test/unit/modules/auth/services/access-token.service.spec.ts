import { JwtService, TokenExpiredError } from '@nestjs/jwt'

import {
  encodePermissionMask,
  permissionRegistryVersion,
} from '@postsop/access-control'
import { Codes } from '@postsop/contracts/http'

import { AppException } from '@/common/exceptions/app.exception'
import { AccessTokenService } from '@/modules/auth/services/access-token.service'

describe('AccessTokenService', () => {
  const jwtService = {
    signAsync: jest.fn((payload: object) =>
      Promise.resolve(JSON.stringify(payload)),
    ),
    verifyAsync: jest.fn((token: string) =>
      Promise.resolve(JSON.parse(token) as object),
    ),
  } as unknown as JwtService

  let service: AccessTokenService

  beforeEach(() => {
    jest.clearAllMocks()
    service = new AccessTokenService(jwtService)
  })

  it('generates and verifies access tokens through JwtService', async () => {
    const payload = {
      pm: encodePermissionMask(['create:user', 'read:user']),
      pv: permissionRegistryVersion,
      sid: 'session-1',
      sub: 42,
    } as const

    const token = await service.generateAccessToken(payload)
    const verifiedPayload =
      await service.verifyAccessTokenSafelyThrownOut(token)

    expect(verifiedPayload).toEqual(payload)
  })

  it('maps expired access tokens to TOKEN_EXPIRED with a generic message', async () => {
    ;(jwtService.verifyAsync as jest.Mock).mockRejectedValue(
      new TokenExpiredError('jwt expired', new Date()),
    )

    const verification = service.verifyAccessTokenSafelyThrownOut(
      'expired-access-token',
    )

    await expect(verification).rejects.toBeInstanceOf(AppException)
    await expect(verification).rejects.toMatchObject({
      code: Codes.TOKEN_EXPIRED,
      message: 'Invalid authorization token',
    })
  })

  it('maps unexpected token failures to TOKEN_INVALID', async () => {
    ;(jwtService.verifyAsync as jest.Mock).mockRejectedValue(
      new Error('broken token'),
    )

    const verification = service.verifyAccessTokenSafelyThrownOut(
      'invalid-access-token',
    )

    await expect(verification).rejects.toBeInstanceOf(AppException)
    await expect(verification).rejects.toMatchObject({
      code: Codes.TOKEN_INVALID,
      message: 'Invalid authorization token',
    })
  })
})
