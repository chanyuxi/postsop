import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { TokenExpiredError } from '@nestjs/jwt'
import { Request } from 'express'

import { AppException } from '@/common/exceptions/app.exception'
import {
  ClaimsSchema,
  toAuthContextPayload,
} from '@/modules/auth/interfaces/claims.interface'
import { AccessTokenService } from '@/modules/auth/services/access-token.service'

import { PUBLIC_KEY } from '../decorators/public.decorator'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly accessTokenService: AccessTokenService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Mark the route or controller of the Public decorator and release it directly
    const isPublic = this.reflector.getAllAndOverride<boolean>(PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ])
    if (isPublic) {
      return true
    }

    // Extract Bearer token from Authorization field in request header
    const request = context.switchToHttp().getRequest<Request>()
    const token = this.extractTokenFromRequest(request)
    if (!token) {
      throw AppException.unauthorized('Missing authorization token')
    }

    try {
      const payload = await this.accessTokenService.verifyAccessToken(token)
      const parsedPayload = ClaimsSchema.safeParse(payload)

      if (!parsedPayload.success) {
        throw AppException.tokenInvalid('Invalid authorization token')
      }

      request.authContext = toAuthContextPayload(parsedPayload.data)
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw AppException.tokenExpired('Token expired')
      }
      if (error instanceof AppException) {
        throw error
      }
      throw AppException.tokenInvalid('Invalid authorization token')
    }

    return true
  }

  private extractTokenFromRequest(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? []
    return type === 'Bearer' ? token : undefined
  }
}
