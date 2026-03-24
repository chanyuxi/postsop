import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PrismaPg } from '@prisma/adapter-pg'

import { ENV_CONSTANTS } from '@/common/constants/env'
import { Prisma, PrismaClient } from '@/generated/prisma/client'

import { PrismaErrorIdentification } from './prisma-error-identification'

const PRISMA_LOG_OPTIONS = [
  {
    emit: 'event',
    level: 'query',
  },
  {
    emit: 'stdout',
    level: 'warn',
  },
  {
    emit: 'stdout',
    level: 'error',
  },
] satisfies [
  {
    emit: 'event'
    level: 'query'
  },
  {
    emit: 'stdout'
    level: 'warn'
  },
  {
    emit: 'stdout'
    level: 'error'
  },
]

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

@Injectable()
export class PrismaService
  extends PrismaClient<PrismaServiceClientOptions>
  implements OnModuleInit, OnModuleDestroy
{
  private static readonly SLOW_QUERY_THRESHOLD_MS = 200
  private readonly logger = new Logger(PrismaService.name, {
    timestamp: true,
  })
  readonly errors = PrismaErrorIdentification

  constructor(private readonly configService: ConfigService) {
    super(
      createPrismaClientOptions(
        configService.getOrThrow(ENV_CONSTANTS.DATABASE_URL),
      ),
    )
    this.registerSlowQueryLogging()
  }

  async onModuleInit() {
    await this.$connect()
    this.logger.log('Prisma client connected')
  }

  async onModuleDestroy() {
    await this.$disconnect()
    this.logger.log('Prisma client disconnected')
  }

  private registerSlowQueryLogging() {
    this.$on('query', (event) => {
      if (event.duration < PrismaService.SLOW_QUERY_THRESHOLD_MS) {
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
}
