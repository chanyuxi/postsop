import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PrismaPg } from '@prisma/adapter-pg'

import { envs } from '@/common/constants/env'
import { Prisma, PrismaClient } from '@/generated/prisma/client'

import { PrismaErrorIdentification } from './prisma-error-identification'

const SLOW_QUERY_THRESHOLD_MS = 200
const PAIRS = ['query.event', 'warn.stdout', 'error.stdout']

// Query logs must emit as events so the service can subscribe to slow queries.
const PRISMA_LOG_OPTIONS = PAIRS.reduce((acc, pair) => {
  const [level, emit] = pair.split('.')
  return [...acc, { level, emit }] as Prisma.LogDefinition[]
}, [] as Prisma.LogDefinition[])

type PrismaServiceClientOptions = Prisma.PrismaClientOptions & {
  log: typeof PRISMA_LOG_OPTIONS
}

function createPrismaClientOptions(
  connectionString: string,
): PrismaServiceClientOptions {
  return {
    adapter: new PrismaPg({ connectionString }),
    log: PRISMA_LOG_OPTIONS,
  }
}

/**
 * Shared Prisma client with lifecycle hooks, slow-query logging,
 * and small database-error helpers for application services.
 */
@Injectable()
export class PrismaService
  extends PrismaClient<PrismaServiceClientOptions>
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name, {
    timestamp: true,
  })

  constructor(configService: ConfigService) {
    super(
      createPrismaClientOptions(configService.getOrThrow(envs.DATABASE_URL)),
    )
    this.registerSlowQueryLogging()
  }

  /**
   * Connects Prisma when the database module is initialized.
   */
  async onModuleInit() {
    await this.$connect()
    this.logger.log('Prisma client connected')
  }

  /**
   * Disconnects Prisma when the application shuts down.
   */
  async onModuleDestroy() {
    await this.$disconnect()
    this.logger.log('Prisma client disconnected')
  }

  private registerSlowQueryLogging() {
    this.$on('query', (event) => {
      if (event.duration < SLOW_QUERY_THRESHOLD_MS) {
        return
      }

      this.logger.warn(
        `Slow query (${event.duration}ms): ${this.summarizeQuery(event.query)}`,
      )
    })
  }

  private summarizeQuery(query: string): string {
    return query.replace(/\s+/g, ' ').trim().slice(0, 180)
  }

  /**
   * Returns `null` when the wrapped operation fails with a unique-constraint error.
   */
  async returnNullOnUniqueConstraint<T>(
    operation: () => Promise<T>,
  ): Promise<T | null> {
    return this.runWithErrorFallback(
      operation,
      PrismaErrorIdentification.isUniqueConstraintError,
      null,
    )
  }

  private async runWithErrorFallback<T, TFallback>(
    operation: () => Promise<T>,
    shouldHandle: (error: unknown) => boolean,
    fallback: TFallback,
  ): Promise<T | TFallback> {
    try {
      return await operation()
    } catch (error) {
      if (shouldHandle(error)) {
        return fallback
      }

      throw error
    }
  }
}
