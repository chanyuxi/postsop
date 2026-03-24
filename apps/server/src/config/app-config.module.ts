import { Logger, Module, OnModuleInit } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

function getEnvFilePath() {
  const defaultEnvFilePath = ['.env.local', '.env']

  const env = process.env.NODE_ENV
  if (env) {
    defaultEnvFilePath.unshift(`.env.${env}.local`, `.env.${env}`)
  }

  return defaultEnvFilePath
}

const envFilePath = getEnvFilePath()

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
    this.logger.log(`Loading from: ${envFilePath.join(', ')}`)
  }
}
