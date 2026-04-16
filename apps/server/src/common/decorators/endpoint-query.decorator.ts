import type { AnyApiEndpoint } from '@postsop/contracts'

import { ZodQuery } from './zod-query.decorator'

export function EndpointQuery<TEndpoint extends AnyApiEndpoint>(
  endpoint: TEndpoint,
): ParameterDecorator {
  if (!endpoint.paramsSchema) {
    throw new TypeError(
      `Endpoint ${endpoint.method} ${endpoint.path} does not define a params schema.`,
    )
  }

  return ZodQuery(endpoint.paramsSchema)
}
