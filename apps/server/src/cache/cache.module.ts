import KeyvRedis from '@keyv/redis'
import { CacheModule as NestCacheModule } from '@nestjs/cache-manager'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'

import { ENV_CONSTANTS } from '@/common/constants/env'

@Module({
  imports: [
    NestCacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          stores: [
            new KeyvRedis(configService.getOrThrow(ENV_CONSTANTS.REDIS_URL)),
          ],
        }
      },
    }),
  ],
})
export class CacheModule {}
