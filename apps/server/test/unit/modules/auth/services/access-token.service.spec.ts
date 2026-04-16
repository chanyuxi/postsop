import { JwtService } from '@nestjs/jwt'

import {
  encodePermissionMask,
  permissionRegistryVersion,
} from '@postsop/access-control'

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
    const verifiedPayload = await service.verifyAccessToken(token)

    expect(verifiedPayload).toEqual(payload)
  })
})
