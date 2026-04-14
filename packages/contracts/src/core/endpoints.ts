import type { ZodType } from 'zod'

export type ApiEndpointMethod = 'DELETE' | 'GET' | 'PATCH' | 'POST' | 'PUT'

export interface ApiEndpoint<TRequest = undefined, TResponse = unknown> {
  method: ApiEndpointMethod
  path: string
  requestSchema?: ZodType<TRequest>
  responseSchema?: ZodType<TResponse>
  skipAuthRefresh?: boolean
}

export type AnyApiEndpoint = ApiEndpoint<unknown, unknown>

export type ApiEndpointRequest<TEndpoint extends AnyApiEndpoint> =
  TEndpoint extends ApiEndpoint<infer TRequest, unknown> ? TRequest : never

export type ApiEndpointResponse<TEndpoint extends AnyApiEndpoint> =
  TEndpoint extends ApiEndpoint<unknown, infer TResponse> ? TResponse : never

export function defineApiEndpoint<TRequest = undefined, TResponse = unknown>(
  endpoint: ApiEndpoint<TRequest, TResponse>
) {
  return endpoint
}
