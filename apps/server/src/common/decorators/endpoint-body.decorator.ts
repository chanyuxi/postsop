import type { PipeTransform } from '@nestjs/common'
import { Body } from '@nestjs/common'
import type { ZodType } from 'zod'

import type { AnyApiEndpoint } from '@postsop/contracts'

import { ZodValidationPipe } from '@/common/pipes/zod.validation.pipe'

const pipeCache = new WeakMap<ZodType, ZodValidationPipe>()

function getCachedZodValidationPipe(schema: ZodType): PipeTransform {
  if (!pipeCache.has(schema)) {
    pipeCache.set(schema, new ZodValidationPipe(schema))
  }

  return pipeCache.get(schema)!
}

export function EndpointBody<TEndpoint extends AnyApiEndpoint>(
  endpoint: TEndpoint,
): ParameterDecorator {
  if (!endpoint.dataSchema) {
    throw new TypeError(
      `Endpoint ${endpoint.method} ${endpoint.path} does not define a data schema.`,
    )
  }

  return Body(getCachedZodValidationPipe(endpoint.dataSchema))
}
