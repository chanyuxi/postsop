import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { TokenExpiredError } from '@nestjs/jwt'
import { Request } from 'express'

import { JwtPayloadSchema } from '@/modules/auth/interfaces/jwt-payload.interface'
import { TokenService } from '@/modules/auth/services/token.service'

import { PUBLIC_KEY } from '../decorators/public.decorator'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly tokenService: TokenService,
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
      throw new UnauthorizedException('Missing authorization token')
    }

    try {
      const payload =
        await this.tokenService.attemptToExtractPayloadFromAccessToken(token)
      const parsedPayload = JwtPayloadSchema.safeParse(payload)

      if (!parsedPayload.success) {
        throw new UnauthorizedException('Invalid authorization token')
      }

      request.jwtPayload = parsedPayload.data
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException('Token expired')
      }
      throw new UnauthorizedException('Invalid authorization token')
    }

    return true
  }

  private extractTokenFromRequest(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? []
    return type === 'Bearer' ? token : undefined
  }
}
