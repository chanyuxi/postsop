import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { APP_GUARD } from '@nestjs/core'
import { JwtModule as NestJwtModule } from '@nestjs/jwt'

import { ENV_CONSTANTS } from '@/common/constants/env'
import { AuthGuard } from '@/common/guards/auth.guard'
import { PermissionGuard } from '@/common/guards/permission.guard'
import { PermissionModule } from '@/modules/permission/permission.module'

import { UserModule } from '../user/user.module'
import { AuthController } from './controllers/auth.controller'
import { AccessTokenService } from './services/access-token.service'
import { AuthService } from './services/auth.service'
import { RefreshSessionService } from './services/refresh-session.service'
import { RefreshAuthSessionUseCase } from './use-cases/refresh-auth-session.use-case'
import { SignInUseCase } from './use-cases/sign-in.use-case'
import { SignOutUseCase } from './use-cases/sign-out.use-case'
import { SignUpUseCase } from './use-cases/sign-up.use-case'

const JwtModule = NestJwtModule.registerAsync({
  imports: [ConfigModule],
  inject: [ConfigService],

  useFactory: (configService: ConfigService) => ({
    secret: configService.getOrThrow(ENV_CONSTANTS.JWT_SECRET),
    signOptions: {
      expiresIn: configService.getOrThrow(ENV_CONSTANTS.JWT_EXPIRATION_TIME),
    },
  }),
})

@Module({
  imports: [JwtModule, UserModule, PermissionModule],
  controllers: [AuthController],
  providers: [
    AccessTokenService,
    AuthService,
    RefreshAuthSessionUseCase,
    RefreshSessionService,
    SignInUseCase,
    SignOutUseCase,
    SignUpUseCase,
    { provide: APP_GUARD, useClass: AuthGuard },
    { provide: APP_GUARD, useClass: PermissionGuard },
  ],
})
export class AuthModule {}
