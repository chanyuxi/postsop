import type { PipeTransform } from '@nestjs/common'
import type { ZodType } from 'zod'

import { ZodValidationPipe } from '@/common/pipes/zod.validation.pipe'

const pipeCache = new WeakMap<ZodType, ZodValidationPipe>()

export function getCachedZodValidationPipe(schema: ZodType): PipeTransform {
  if (!pipeCache.has(schema)) {
    pipeCache.set(schema, new ZodValidationPipe(schema))
  }

  return pipeCache.get(schema)!
}
