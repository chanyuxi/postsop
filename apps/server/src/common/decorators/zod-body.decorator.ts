import { Body } from '@nestjs/common'
import type { ZodType } from 'zod'

import { ZodValidationPipe } from '@/common/pipes/zod.validation.pipe'

const pipeCache = new WeakMap<ZodType, ZodValidationPipe>()

export const ZodBody =
  (schema: ZodType): ParameterDecorator =>
  (target, propertyKey, parameterIndex) => {
    if (!pipeCache.has(schema)) {
      pipeCache.set(schema, new ZodValidationPipe(schema))
    }
    Body(pipeCache.get(schema)!)(target, propertyKey, parameterIndex)
  }
