import { Controller, Get, Post } from '@nestjs/common'

import {
  type RefreshTokenRequest,
  RefreshTokenRequestSchema,
  type SignInRequest,
  SignInRequestSchema,
  type SignUpRequest,
  SignUpRequestSchema,
} from '@postsop/contracts/auth'

import { AuthContext } from '@/common/decorators/auth-context.decorator'
import { Public } from '@/common/decorators/public.decorator'
import { ZodBody } from '@/common/decorators/zod-body.decorator'

import { AuthService } from '../services/auth.service'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('greeting')
  greeting(@AuthContext('user.id') userId: number) {
    return { message: `Welcome to Coco, ${userId}` }
  }

  @Public()
  @Post('sign-up')
  signUp(@ZodBody(SignUpRequestSchema) signUpRequest: SignUpRequest) {
    return this.authService.signUp(signUpRequest)
  }

  @Public()
  @Post('sign-in')
  signIn(@ZodBody(SignInRequestSchema) signInRequest: SignInRequest) {
    return this.authService.signIn(signInRequest)
  }

  @Post('sign-out')
  signOut(@AuthContext('sessionId') sessionId: string) {
    return this.authService.signOut(sessionId)
  }

  @Public()
  @Post('refresh-token')
  refreshToken(
    @ZodBody(RefreshTokenRequestSchema)
    refreshTokenRequest: RefreshTokenRequest,
  ) {
    return this.authService.refreshToken(refreshTokenRequest.refreshToken)
  }
}
