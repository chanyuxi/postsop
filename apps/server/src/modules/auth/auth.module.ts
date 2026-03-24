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
import { AuthService } from './services/auth.service'
import { TokenService } from './services/token.service'

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

const accessGuards = [
  {
    provide: APP_GUARD,
    useClass: AuthGuard,
  },
  {
    provide: APP_GUARD,
    useClass: PermissionGuard,
  },
]

@Module({
  imports: [JwtModule, UserModule, PermissionModule],
  controllers: [AuthController],
  providers: [AuthService, TokenService, ...accessGuards],
})
export class AuthModule {}
