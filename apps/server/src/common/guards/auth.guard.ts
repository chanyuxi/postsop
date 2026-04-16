import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { TokenExpiredError } from '@nestjs/jwt'
import { Request } from 'express'

import { AppException } from '@/common/exceptions/app.exception'
import { AccessTokenService } from '@/modules/auth/services/access-token.service'

import { PUBLIC_KEY } from '../decorators/public.decorator'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly accessTokenService: AccessTokenService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (this.isPublic(context)) {
      return true
    }

    // Extract Bearer token from Authorization field in request header
    const request = context.switchToHttp().getRequest<Request>()
    const token = this.extractTokenFromRequest(request)

    if (!token) {
      throw AppException.unauthorized('Missing authorization token')
    }

    try {
      request.authContext =
        await this.accessTokenService.verifyAccessToken(token)
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw AppException.tokenExpired('Invalid authorization token')
      }
      if (error instanceof AppException) {
        throw error
      }
      throw AppException.tokenInvalid('Invalid authorization token')
    }

    return true
  }

  private isPublic(context: ExecutionContext) {
    return this.reflector.getAllAndOverride<boolean>(PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ])
  }

  private extractTokenFromRequest(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? []
    return type === 'Bearer' ? token : undefined
  }
}
