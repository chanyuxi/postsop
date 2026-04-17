import { Injectable } from '@nestjs/common'
import { JwtService, TokenExpiredError } from '@nestjs/jwt'

import { AppException } from '@/common/exceptions/app.exception'

import type { AuthContextPayload } from '../interfaces/claims.interface'
import { parseAuthContextPayload } from '../interfaces/claims.interface'

@Injectable()
export class AccessTokenService {
  constructor(private readonly jwtService: JwtService) {}

  generateAccessToken(payload: AuthContextPayload) {
    return this.jwtService.signAsync(payload)
  }

  async verifyAccessTokenSafelyThrownOut(
    token: string,
  ): Promise<AuthContextPayload> {
    try {
      const payload = await this.jwtService.verifyAsync(token)

      return parseAuthContextPayload(payload)
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw AppException.tokenExpired('Invalid authorization token')
      }

      throw AppException.tokenInvalid('Invalid authorization token')
    }
  }
}
