import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

import type { AuthContextPayload, Claims } from '../interfaces/claims.interface'

@Injectable()
export class AccessTokenService {
  constructor(private readonly jwtService: JwtService) {}

  generateAccessToken(payload: AuthContextPayload) {
    return this.jwtService.signAsync(payload)
  }

  verifyAccessToken(token: string) {
    return this.jwtService.verifyAsync<Claims>(token)
  }
}
