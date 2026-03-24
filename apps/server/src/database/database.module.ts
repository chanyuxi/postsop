import { Global, Logger, Module, OnModuleInit } from '@nestjs/common'

import { PrismaService } from './prisma.service'

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class DatabaseModule implements OnModuleInit {
  private readonly logger = new Logger(DatabaseModule.name, {
    timestamp: true,
  })

  onModuleInit() {
    this.logger.log('Database module initialized')
  }
}
