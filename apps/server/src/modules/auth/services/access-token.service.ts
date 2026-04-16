import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

import { AppException } from '@/common/exceptions/app.exception'

import type { AuthContextPayload } from '../interfaces/claims.interface'
import { parseAuthContextPayload } from '../interfaces/claims.interface'

@Injectable()
export class AccessTokenService {
  constructor(private readonly jwtService: JwtService) {}

  generateAccessToken(payload: AuthContextPayload) {
    return this.jwtService.signAsync(payload)
  }

  async verifyAccessToken(token: string): Promise<AuthContextPayload> {
    const payload = await this.jwtService.verifyAsync(token)

    try {
      return parseAuthContextPayload(payload)
    } catch {
      throw AppException.tokenInvalid('Invalid authorization token')
    }
  }
}
