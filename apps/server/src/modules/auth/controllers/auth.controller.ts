import { Controller, Get, Post } from '@nestjs/common'

import {
  RefreshTokenSchema,
  SignInSchema,
  SignUpSchema,
} from '@postsop/contracts/schemas'

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
  signUp(@ZodBody(SignUpSchema) signUpSchema: SignUpSchema) {
    return this.authService.signUp(signUpSchema)
  }

  @Public()
  @Post('sign-in')
  signIn(@ZodBody(SignInSchema) signInSchema: SignInSchema) {
    return this.authService.signIn(signInSchema)
  }

  @Post('sign-out')
  signOut(@AuthContext('sessionId') sessionId: string) {
    return this.authService.signOut(sessionId)
  }

  @Public()
  @Post('refresh-token')
  refreshToken(
    @ZodBody(RefreshTokenSchema) refreshTokenSchema: RefreshTokenSchema,
  ) {
    return this.authService.refreshToken(refreshTokenSchema.refreshToken)
  }
}
