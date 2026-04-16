import { Logger, Module, OnModuleInit } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

const envFilePath = ['.env.local', '.env']

const env = process.env['NODE_ENV']
if (env) {
  envFilePath.unshift(`.env.${env}.local`, `.env.${env}`)
}

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: envFilePath,
    }),
  ],
})
export class AppConfigModule implements OnModuleInit {
  private readonly logger = new Logger(AppConfigModule.name, {
    timestamp: true,
  })

  onModuleInit() {
    this.logger.log(envFilePath.join(', '))
  }
}
