import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

import type { JwtPayload } from '../interfaces/jwt-payload.interface'

@Injectable()
export class AccessTokenService {
  constructor(private readonly jwtService: JwtService) {}

  generateAccessToken(payload: JwtPayload) {
    return this.jwtService.signAsync(payload)
  }

  verifyAccessToken(token: string) {
    return this.jwtService.verifyAsync<JwtPayload>(token)
  }
}
