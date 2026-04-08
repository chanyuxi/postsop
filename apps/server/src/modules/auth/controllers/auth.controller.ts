import { Controller, Get, Post } from '@nestjs/common'
import { RefreshTokenDto, SignInDto, SignUpDto } from '@postsop/contracts/type'

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
  signUp(@ZodBody(SignUpDto) signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto)
  }

  @Public()
  @Post('sign-in')
  signIn(@ZodBody(SignInDto) signInDto: SignInDto) {
    return this.authService.signIn(signInDto)
  }

  @Post('sign-out')
  signOut(@AuthContext('sessionId') sessionId: string) {
    return this.authService.signOut(sessionId)
  }

  @Public()
  @Post('refresh-token')
  refreshToken(@ZodBody(RefreshTokenDto) refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto.refreshToken)
  }
}
