import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'

import type {
  AuthTokens,
  RefreshTokenResult,
  SignInDto,
  SignInResult,
  SignUpDto,
} from '@postsop/contracts/type'

import { verifyPassword } from '@/common/utils/password.util'
import { UserService } from '@/modules/user/services/user.service'

import type { JwtPayload } from '../interfaces/jwt-payload.interface'
import type { AuthSession } from './token.service'
import { TokenService } from './token.service'

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
  ) {}

  async signUp(signUpDto: SignUpDto) {
    const user = await this.userService.createUser(signUpDto)

    if (!user) {
      throw new BadRequestException('User already exists')
    }
  }

  async signIn(signInDto: SignInDto): Promise<SignInResult> {
    const user = await this.userService.findAuthUserByEmail(signInDto.email)

    if (!user || !(await verifyPassword(signInDto.password, user.password))) {
      throw new UnauthorizedException('Invalid email or password')
    }

    const session = await this.tokenService.createSession(user.id)
    const tokens = await this.issueTokenPair(session)

    return {
      tokens,
      user: {
        id: user.id,
        email: user.email,
        roles: user.roles,
      },
    }
  }

  async signOut(sessionId: string) {
    await this.tokenService.invalidateSession(sessionId)
  }

  async refreshToken(refreshToken: string): Promise<RefreshTokenResult> {
    const session = await this.tokenService.rotateSession(refreshToken)
    const user = await this.userService.findUserById(session.userId)

    if (!user) {
      await this.tokenService.invalidateSession(session.sessionId)
      throw new UnauthorizedException('Refresh token user no longer exists')
    }

    return this.issueTokenPair(session)
  }

  private async issueTokenPair(session: AuthSession): Promise<AuthTokens> {
    const jwtPayload: JwtPayload = {
      user: {
        id: session.userId,
      },
      sessionId: session.sessionId,
    }

    const accessToken = await this.tokenService.generateAccessToken(jwtPayload)

    return {
      accessToken,
      refreshToken: session.refreshToken,
    }
  }
}
