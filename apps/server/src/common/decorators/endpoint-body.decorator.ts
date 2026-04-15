import type { AnyApiEndpoint } from '@postsop/contracts/core'

import { ZodBody } from './zod-body.decorator'

export function EndpointBody<TEndpoint extends AnyApiEndpoint>(
  endpoint: TEndpoint,
): ParameterDecorator {
  if (!endpoint.dataSchema) {
    throw new TypeError(
      `Endpoint ${endpoint.method} ${endpoint.path} does not define a data schema.`,
    )
  }

  return ZodBody(endpoint.dataSchema)
}
