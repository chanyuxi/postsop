import { Module } from '@nestjs/common'

import { CacheModule } from '@/cache/cache.module'
import { AppConfigModule } from '@/config/app-config.module'
import { DatabaseModule } from '@/database/database.module'
import { AuthModule } from '@/modules/auth/auth.module'

@Module({
  imports: [AppConfigModule, CacheModule, DatabaseModule, AuthModule],
})
export class AppModule {}
