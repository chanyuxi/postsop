import type { Cache } from '@nestjs/cache-manager'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common'

const REDIS_HEALTH_CHECK_KEY_PREFIX = 'health-check:redis'
const REDIS_HEALTH_CHECK_TTL_MS = 5_000

@Injectable()
export class RedisConnectionService implements OnModuleInit {
  private readonly logger = new Logger(RedisConnectionService.name, {
    timestamp: true,
  })

  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  async onModuleInit() {
    const healthCheckKey = `${REDIS_HEALTH_CHECK_KEY_PREFIX}:${process.pid}:${Date.now()}`

    try {
      await this.cacheManager.set(
        healthCheckKey,
        healthCheckKey,
        REDIS_HEALTH_CHECK_TTL_MS,
      )

      const cachedValue = await this.cacheManager.get<string>(healthCheckKey)
      await this.cacheManager.del(healthCheckKey)

      if (cachedValue !== healthCheckKey) {
        throw new Error('Redis health check returned an unexpected value')
      }

      this.logger.log('Redis cache connected')
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      this.logger.error(`Redis cache connection failed: ${message}`)
      throw new Error(`Redis cache connection failed: ${message}`)
    }
  }
}
