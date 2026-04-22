import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'

import { AppModule } from '@/app.module'
import { envs } from '@/common/constants/env'
import { ApiExceptionFilter } from '@/common/filters/api-exception.filter'
import { ResponseEncapsulationInterceptor } from '@/common/interceptors/response-encapsulation.interceptor'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  try {
    const configService = app.get(ConfigService)

    app.enableShutdownHooks()
    app.useGlobalFilters(new ApiExceptionFilter())
    app.useGlobalInterceptors(new ResponseEncapsulationInterceptor())

    await app.listen(Number(configService.getOrThrow(envs.PORT)))
  } catch (error) {
    await app.close()
    throw error
  }
}

async function safeBootstrap() {
  try {
    await bootstrap()
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

void safeBootstrap()
