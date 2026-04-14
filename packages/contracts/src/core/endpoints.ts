import type { ZodType } from 'zod'

export type ApiEndpointMethod = 'DELETE' | 'GET' | 'PATCH' | 'POST' | 'PUT'

type EndpointRequestPart<TKey extends string, TValue> = [TValue] extends [
  undefined,
]
  ? // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    {}
  : Record<TKey, TValue>

type Simplify<T> = {
  [K in keyof T]: T[K]
}

type CompositeApiEndpointRequest<TParams, TQuery, TBody> = Simplify<
  EndpointRequestPart<'params', TParams> &
    EndpointRequestPart<'query', TQuery> &
    EndpointRequestPart<'body', TBody>
>

export interface ApiEndpoint<
  TParams = undefined,
  TQuery = undefined,
  TBody = undefined,
  TResponse = unknown,
> {
  method: ApiEndpointMethod
  path: string
  paramsSchema?: ZodType<TParams>
  querySchema?: ZodType<TQuery>
  bodySchema?: ZodType<TBody>
  responseSchema?: ZodType<TResponse>
  skipAuthRefresh?: boolean
}

export type AnyApiEndpoint = ApiEndpoint<unknown, unknown, unknown, unknown>

export type ApiEndpointParams<TEndpoint extends AnyApiEndpoint> =
  TEndpoint extends ApiEndpoint<infer TParams, unknown, unknown, unknown>
    ? TParams
    : never

export type ApiEndpointQuery<TEndpoint extends AnyApiEndpoint> =
  TEndpoint extends ApiEndpoint<unknown, infer TQuery, unknown, unknown>
    ? TQuery
    : never

export type ApiEndpointBody<TEndpoint extends AnyApiEndpoint> =
  TEndpoint extends ApiEndpoint<unknown, unknown, infer TBody, unknown>
    ? TBody
    : never

export type ApiEndpointRequest<TEndpoint extends AnyApiEndpoint> =
  TEndpoint extends ApiEndpoint<
    infer TParams,
    infer TQuery,
    infer TBody,
    unknown
  >
    ? [TParams] extends [undefined]
      ? [TQuery] extends [undefined]
        ? [TBody] extends [undefined]
          ? undefined
          : TBody
        : [TBody] extends [undefined]
          ? TQuery
          : CompositeApiEndpointRequest<TParams, TQuery, TBody>
      : [TQuery] extends [undefined]
        ? [TBody] extends [undefined]
          ? TParams
          : CompositeApiEndpointRequest<TParams, TQuery, TBody>
        : CompositeApiEndpointRequest<TParams, TQuery, TBody>
    : never

export type ApiEndpointResponse<TEndpoint extends AnyApiEndpoint> =
  TEndpoint extends ApiEndpoint<unknown, unknown, unknown, infer TResponse>
    ? TResponse
    : never

export function defineApiEndpoint<
  TParams = undefined,
  TQuery = undefined,
  TBody = undefined,
  TResponse = unknown,
>(endpoint: ApiEndpoint<TParams, TQuery, TBody, TResponse>) {
  return endpoint
}
