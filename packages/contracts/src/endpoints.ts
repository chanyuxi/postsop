import type { ZodType } from 'zod'

export type ApiEndpointMethod = 'DELETE' | 'GET' | 'PATCH' | 'POST' | 'PUT'

type ApiEndpointRequestPart<TKey extends string, TValue> = [TValue] extends [
  undefined,
]
  ? // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    {}
  : Record<TKey, TValue>

/**
 * Shared endpoint contract used by both the client and the server.
 */
export interface ApiEndpoint<
  TParams = undefined,
  TData = undefined,
  TResponse = unknown,
> {
  method: ApiEndpointMethod
  path: string
  paramsSchema?: ZodType<TParams>
  dataSchema?: ZodType<TData>
  responseSchema: ZodType<TResponse>
  skipAuthRefresh?: boolean
}

export type AnyApiEndpoint = ApiEndpoint<unknown, unknown, unknown>

export type ApiEndpointParams<TEndpoint extends AnyApiEndpoint> =
  TEndpoint extends ApiEndpoint<infer TParams, unknown, unknown>
    ? TParams
    : never

export type ApiEndpointData<TEndpoint extends AnyApiEndpoint> =
  TEndpoint extends ApiEndpoint<unknown, infer TData, unknown> ? TData : never

/**
 * Semantic request payload used by endpoint-driven request helpers.
 * The shape intentionally matches axios naming: `params` for query strings
 * and `data` for request bodies.
 */
export type ApiEndpointRequest<TEndpoint extends AnyApiEndpoint> =
  ApiEndpointRequestPart<'data', ApiEndpointData<TEndpoint>> &
    ApiEndpointRequestPart<'params', ApiEndpointParams<TEndpoint>>

export type ApiEndpointResponse<TEndpoint extends AnyApiEndpoint> =
  TEndpoint extends ApiEndpoint<unknown, unknown, infer TResponse>
    ? TResponse
    : never

/**
 * Preserves endpoint inference while keeping the declaration site concise.
 */
export function defineApiEndpoint<
  TParams = undefined,
  TData = undefined,
  TResponse = unknown,
>(endpoint: ApiEndpoint<TParams, TData, TResponse>) {
  return endpoint
}
