import KeyvRedis from '@keyv/redis'
import { CacheModule as NestCacheModule } from '@nestjs/cache-manager'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'

import { envs } from '@/common/constants/env'

import { RedisConnectionService } from './redis-connection.service'

const REDIS_CONNECTION_TIMEOUT_MS = 5_000

@Module({
  imports: [
    NestCacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          stores: [
            new KeyvRedis(configService.getOrThrow(envs.REDIS_URL), {
              connectionTimeout: REDIS_CONNECTION_TIMEOUT_MS,
              throwOnErrors: true,
            }),
          ],
        }
      },
    }),
  ],
  providers: [RedisConnectionService],
})
export class CacheModule {}
