import {
  applyDecorators,
  Delete,
  Get,
  Patch,
  Post,
  Put,
  SetMetadata,
  UseInterceptors,
} from '@nestjs/common'

import type { AnyApiEndpoint, ApiEndpointMethod } from '@postsop/contracts'

import { EndpointResponseValidationInterceptor } from '@/common/interceptors/endpoint-response-validation.interceptor'

export const API_ENDPOINT_METADATA = Symbol('api-endpoint')

const METHOD_DECORATOR_MAP = {
  DELETE: Delete,
  GET: Get,
  PATCH: Patch,
  POST: Post,
  PUT: Put,
} satisfies Record<
  ApiEndpointMethod,
  (path?: string | string[]) => MethodDecorator
>

export function EndpointHandler<TEndpoint extends AnyApiEndpoint>(
  endpoint: TEndpoint,
): MethodDecorator {
  return applyDecorators(
    SetMetadata(API_ENDPOINT_METADATA, endpoint),
    METHOD_DECORATOR_MAP[endpoint.method](
      normalizeEndpointRoutePath(endpoint.path),
    ),
    UseInterceptors(new EndpointResponseValidationInterceptor(endpoint)),
  )
}

function normalizeEndpointRoutePath(path: string) {
  return path.replace(/^\/+/, '')
}
