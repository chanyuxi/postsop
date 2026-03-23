import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'

import { AppModule } from '@/app.module'
import { ENV_CONSTANTS } from '@/common/constants/env'

import { ResponseEncapsulationInterceptor } from './common/interceptors/response-encapsulation.interceptor'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  const configService = app.get(ConfigService)

  app.enableShutdownHooks()
  app.useGlobalInterceptors(new ResponseEncapsulationInterceptor())

  await app.listen(Number(configService.getOrThrow(ENV_CONSTANTS.PORT)))
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap()
