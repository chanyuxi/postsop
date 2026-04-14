import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios'
import axios, { AxiosError } from 'axios'

import type { ApiEndpoint } from '@postsop/contracts/core'
import type { ApiResponse } from '@postsop/contracts/http'
import { ApiError, InternalStatusCodes } from '@postsop/contracts/http'
import type { MaybePromise } from '@postsop/types'

type AnyApiEndpoint = ApiEndpoint<unknown, unknown, unknown, unknown>
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
type ApiEndpointRequestInput<TParams, TQuery, TBody> = [TParams] extends [
  undefined,
]
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
type ApiEndpointResult<TEndpoint extends AnyApiEndpoint> =
  TEndpoint extends ApiEndpoint<unknown, unknown, unknown, infer TResponse>
    ? TResponse
    : never
type EndpointRequestData<TEndpoint extends AnyApiEndpoint> =
  ApiEndpointRequestInput<
    TEndpoint extends ApiEndpoint<infer TParams, unknown, unknown, unknown>
      ? TParams
      : never,
    TEndpoint extends ApiEndpoint<unknown, infer TQuery, unknown, unknown>
      ? TQuery
      : never,
    TEndpoint extends ApiEndpoint<unknown, unknown, infer TBody, unknown>
      ? TBody
      : never
  >

interface ResolvedEndpointRequest {
  body: unknown
  config?: ApiClientRequestConfig
  query: unknown
  url: string
}

export interface ApiClientRequestConfig<
  D = unknown,
> extends AxiosRequestConfig<D> {
  skipAuthRefresh?: boolean
}

interface RetryableRequestConfig<
  D = unknown,
> extends InternalAxiosRequestConfig<D> {
  _retryCount?: number
  skipAuthRefresh?: boolean
}

interface RequestQueueEntry {
  reject: (error: unknown) => void
  resolve: (token: string) => void
}

/**
 * Sends a request using a shared endpoint contract.
 */
export interface ApiEndpointRequester {
  <TEndpoint extends ApiEndpoint<undefined, undefined, undefined, unknown>>(
    endpoint: TEndpoint,
    config?: ApiClientRequestConfig
  ): Promise<ApiEndpointResult<TEndpoint>>
  <TParams, TQuery, TBody, TResponse>(
    endpoint: ApiEndpoint<TParams, TQuery, TBody, TResponse>,
    requestData: ApiEndpointRequestInput<TParams, TQuery, TBody>,
    config?: ApiClientRequestConfig
  ): Promise<TResponse>
}

/**
 * Runtime dependencies needed by the refresh flow.
 */
export interface ApiClientAuthRefreshContext {
  bareClient: AxiosInstance
  bareRequest: <T = unknown, D = unknown>(
    config: ApiClientRequestConfig<D>
  ) => Promise<T>
  bareRequestEndpoint: ApiEndpointRequester
  refreshToken: string
}

/**
 * Tokens returned after a successful refresh.
 */
export interface ApiClientAuthRefreshResult {
  accessToken: string
  refreshToken?: string
}

/**
 * Strategy hooks for authenticated requests and token refresh.
 */
export interface ApiClientAuthOptions {
  getAccessToken: () => MaybePromise<string | undefined>
  getRefreshToken: () => MaybePromise<string | undefined>
  refreshAccessToken: (
    context: ApiClientAuthRefreshContext
  ) => MaybePromise<ApiClientAuthRefreshResult>
  attachAccessToken?: (
    config: InternalAxiosRequestConfig,
    accessToken: string | undefined
  ) => void
  isTokenExpiringSoon?: (accessToken: string | undefined) => boolean
  onRefreshFailure?: (error: ApiError) => MaybePromise<void>
  onRefreshSuccess?: (
    refreshedAuth: ApiClientAuthRefreshResult
  ) => MaybePromise<void>
  shouldRefresh?: (error: ApiError, config: RetryableRequestConfig) => boolean
  shouldSkipAuthRefresh?: (
    config: ApiClientRequestConfig | RetryableRequestConfig
  ) => boolean
}

/**
 * Factory options for the shared API client.
 */
export interface CreateApiClientOptions {
  auth?: ApiClientAuthOptions
  baseURL: string
  configureHeaders?: (config: InternalAxiosRequestConfig) => void
  defaultHeaders?: Record<string, string>
  timeout?: number
}

/**
 * Public API surface returned by `createApiClient`.
 */
export interface ApiClient {
  bareClient: AxiosInstance
  client: AxiosInstance
  del: <T = null>(url: string, config?: ApiClientRequestConfig) => Promise<T>
  get: <T = null>(url: string, config?: ApiClientRequestConfig) => Promise<T>
  normalizeUnknownError: (error: unknown) => ApiError
  patch: <T = null>(
    url: string,
    data?: unknown,
    config?: ApiClientRequestConfig
  ) => Promise<T>
  post: <T = null>(
    url: string,
    data?: unknown,
    config?: ApiClientRequestConfig
  ) => Promise<T>
  put: <T = null>(
    url: string,
    data?: unknown,
    config?: ApiClientRequestConfig
  ) => Promise<T>
  requestEndpoint: ApiEndpointRequester
  request: <T = null, D = unknown>(
    config: ApiClientRequestConfig<D>
  ) => Promise<T>
}

/**
 * Adds JSON request headers to an axios config.
 */
export function configureJsonHeaders(config: InternalAxiosRequestConfig) {
  setHeader(config, 'Content-Type', 'application/json')
}

/**
 * Attaches a bearer token when one is available.
 */
export function attachBearerToken(
  config: InternalAxiosRequestConfig,
  accessToken: string | undefined
) {
  if (!accessToken) {
    return
  }

  setHeader(config, 'Authorization', `Bearer ${accessToken}`)
}

/**
 * Creates a reusable API client with optional auth refresh support.
 */
export function createApiClient(options: CreateApiClientOptions): ApiClient {
  const { auth } = options
  const bareClient = axios.create({
    baseURL: options.baseURL,
    headers: options.defaultHeaders,
    timeout: options.timeout,
  })
  const client = axios.create({
    baseURL: options.baseURL,
    headers: options.defaultHeaders,
    timeout: options.timeout,
  })

  let refreshPromise: Promise<string> | null = null
  let requestQueue: RequestQueueEntry[] = []

  const bareRequest = async <T = null, D = unknown>(
    config: ApiClientRequestConfig<D>
  ): Promise<T> => {
    try {
      const response = await bareClient.request<ApiResponse<T>>(config)

      return unwrapApiResponseData(response)
    } catch (error) {
      throw normalizeUnknownError(error)
    }
  }

  const bareRequestEndpoint: ApiEndpointRequester = async <
    TEndpoint extends AnyApiEndpoint,
  >(
    endpoint: TEndpoint,
    requestDataOrConfig?:
      | ApiClientRequestConfig
      | EndpointRequestData<TEndpoint>,
    maybeConfig?: ApiClientRequestConfig
  ): Promise<ApiEndpointResult<TEndpoint>> => {
    const { body, config, query, url } = resolveEndpointRequestArguments(
      endpoint,
      requestDataOrConfig,
      maybeConfig
    )
    const responseData = await bareRequest<ApiEndpointResult<TEndpoint>>({
      ...config,
      data: body,
      method: endpoint.method,
      params: query,
      skipAuthRefresh: endpoint.skipAuthRefresh ?? config?.skipAuthRefresh,
      url,
    })

    return parseEndpointResponse(endpoint, responseData)
  }

  bareClient.interceptors.request.use((config) => {
    options.configureHeaders?.(config)

    return config
  })

  client.interceptors.request.use(async (config: RetryableRequestConfig) => {
    options.configureHeaders?.(config)

    if (!auth) {
      return config
    }

    if (refreshPromise && !isAuthRefreshSkipped(auth, config)) {
      return new Promise((resolve, reject) => {
        requestQueue.push({
          resolve: (token) => {
            getAttachAccessToken(auth)(config, token)
            resolve(config)
          },
          reject,
        })
      })
    }

    const accessToken = await auth.getAccessToken()

    if (
      auth.isTokenExpiringSoon?.(accessToken) &&
      !isAuthRefreshSkipped(auth, config)
    ) {
      const nextAccessToken = await refreshAccessToken()

      getAttachAccessToken(auth)(config, nextAccessToken)
      return config
    }

    getAttachAccessToken(auth)(config, accessToken)
    return config
  })

  client.interceptors.response.use(
    undefined,
    async (error: AxiosError<{ code?: number; message?: string }>) => {
      const apiError = normalizeAxiosError(error)

      if (!auth) {
        throw apiError
      }

      return processApiError(
        apiError,
        error.config as RetryableRequestConfig | undefined
      )
    }
  )

  const request = async <T = null, D = unknown>(
    config: ApiClientRequestConfig<D>
  ): Promise<T> => {
    const response = await client.request<ApiResponse<T>>(config)

    return unwrapApiResponseData(response)
  }

  async function processApiError(
    error: ApiError,
    config?: RetryableRequestConfig
  ) {
    if (!auth || !config || !shouldRefresh(auth, error, config)) {
      throw error
    }

    if (isAuthRefreshSkipped(auth, config)) {
      throw error
    }

    config._retryCount = (config._retryCount ?? 0) + 1

    if (config._retryCount > 1) {
      await auth.onRefreshFailure?.(error)
      throw error
    }

    const nextAccessToken = await refreshAccessToken()

    getAttachAccessToken(auth)(config, nextAccessToken)

    return client.request(config)
  }

  async function refreshAccessToken(): Promise<string> {
    if (refreshPromise) {
      return refreshPromise
    }

    refreshPromise = (async () => {
      const refreshToken = await auth?.getRefreshToken()

      if (!refreshToken) {
        const error = ApiError.http(401, 'Missing refresh token')

        await auth?.onRefreshFailure?.(error)
        flushRequestQueue(error)
        throw error
      }

      try {
        const refreshedAuth = await auth!.refreshAccessToken({
          bareClient,
          bareRequest,
          bareRequestEndpoint,
          refreshToken,
        })

        await auth?.onRefreshSuccess?.(refreshedAuth)
        flushRequestQueue(null, refreshedAuth.accessToken)

        return refreshedAuth.accessToken
      } catch (error) {
        const normalizedError = normalizeUnknownError(error)

        await auth?.onRefreshFailure?.(normalizedError)
        flushRequestQueue(normalizedError)
        throw normalizedError
      } finally {
        refreshPromise = null
      }
    })()

    return refreshPromise
  }

  function flushRequestQueue(error: unknown, token?: string) {
    requestQueue.forEach(({ reject, resolve }) => {
      if (error) {
        reject(error)
        return
      }

      resolve(token!)
    })

    requestQueue = []
  }

  function normalizeAxiosError(
    error: AxiosError<{ code?: number; message?: string }>
  ): ApiError {
    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      return ApiError.timeout()
    }

    if (!error.response) {
      return ApiError.network()
    }

    const { data, status } = error.response

    return new ApiError(data?.message || error.message, status, data?.code)
  }

  function normalizeUnknownError(error: unknown): ApiError {
    if (error instanceof ApiError) {
      return error
    }

    if (axios.isAxiosError(error)) {
      return normalizeAxiosError(error)
    }

    throw error
  }

  return {
    bareClient,
    client,
    del: (url, config) => request({ ...config, method: 'DELETE', url }),
    get: (url, config) => request({ ...config, method: 'GET', url }),
    normalizeUnknownError,
    patch: (url, data, config) =>
      request({ ...config, data, method: 'PATCH', url }),
    post: (url, data, config) =>
      request({ ...config, data, method: 'POST', url }),
    put: (url, data, config) =>
      request({ ...config, data, method: 'PUT', url }),
    requestEndpoint: async <TEndpoint extends AnyApiEndpoint>(
      endpoint: TEndpoint,
      requestDataOrConfig?:
        | ApiClientRequestConfig
        | EndpointRequestData<TEndpoint>,
      maybeConfig?: ApiClientRequestConfig
    ) => {
      const { body, config, query, url } = resolveEndpointRequestArguments(
        endpoint,
        requestDataOrConfig,
        maybeConfig
      )
      const responseData = await request<ApiEndpointResult<TEndpoint>>({
        ...config,
        data: body,
        method: endpoint.method,
        params: query,
        skipAuthRefresh: endpoint.skipAuthRefresh ?? config?.skipAuthRefresh,
        url,
      })

      return parseEndpointResponse(endpoint, responseData)
    },
    request,
  }
}

function getAttachAccessToken(auth: ApiClientAuthOptions) {
  return auth.attachAccessToken ?? attachBearerToken
}

function isAuthRefreshSkipped(
  auth: ApiClientAuthOptions,
  config: ApiClientRequestConfig | RetryableRequestConfig
) {
  return auth.shouldSkipAuthRefresh?.(config) ?? false
}

function shouldRefresh(
  auth: ApiClientAuthOptions,
  error: ApiError,
  config: RetryableRequestConfig
) {
  return auth.shouldRefresh?.(error, config) ?? error.needsRefresh
}

function setHeader(
  config: InternalAxiosRequestConfig,
  key: string,
  value: string
) {
  if (typeof config.headers.set === 'function') {
    config.headers.set(key, value)
    return
  }

  config.headers[key] = value
}

function unwrapApiResponseData<T>(response: AxiosResponse<ApiResponse<T>>): T {
  const { data } = response.data

  if (response.data.code !== InternalStatusCodes.SUCCESS) {
    throw ApiError.internal(response.data.code, response.data.message)
  }

  return data
}

function parseEndpointResponse<TEndpoint extends AnyApiEndpoint>(
  endpoint: TEndpoint,
  responseData: ApiEndpointResult<TEndpoint>
) {
  if (!endpoint.responseSchema) {
    return responseData
  }

  return endpoint.responseSchema.parse(
    responseData
  ) as ApiEndpointResult<TEndpoint>
}

function resolveEndpointRequestArguments<TEndpoint extends AnyApiEndpoint>(
  endpoint: TEndpoint,
  requestDataOrConfig?: ApiClientRequestConfig | EndpointRequestData<TEndpoint>,
  maybeConfig?: ApiClientRequestConfig
): ResolvedEndpointRequest {
  if (!hasEndpointRequest(endpoint)) {
    return {
      body: undefined,
      config: requestDataOrConfig as ApiClientRequestConfig | undefined,
      query: undefined,
      url: endpoint.path,
    }
  }

  const requestData = requestDataOrConfig as EndpointRequestData<TEndpoint>
  const { body, params, query } = parseEndpointRequestData(
    endpoint,
    requestData
  )

  return {
    body,
    config: maybeConfig,
    query,
    url: buildEndpointUrl(endpoint.path, params),
  }
}

function hasEndpointRequest(endpoint: AnyApiEndpoint) {
  return !!(
    endpoint.bodySchema ||
    endpoint.paramsSchema ||
    endpoint.querySchema
  )
}

function parseEndpointRequestData<TEndpoint extends AnyApiEndpoint>(
  endpoint: TEndpoint,
  requestData: EndpointRequestData<TEndpoint>
) {
  if (endpoint.paramsSchema && endpoint.querySchema) {
    const compositeRequest = requestData as {
      body?: unknown
      params: unknown
      query: unknown
    }

    return {
      body: endpoint.bodySchema?.parse(compositeRequest.body),
      params: endpoint.paramsSchema.parse(compositeRequest.params),
      query: endpoint.querySchema.parse(compositeRequest.query),
    }
  }

  if (endpoint.paramsSchema && endpoint.bodySchema) {
    const compositeRequest = requestData as {
      body: unknown
      params: unknown
    }

    return {
      body: endpoint.bodySchema.parse(compositeRequest.body),
      params: endpoint.paramsSchema.parse(compositeRequest.params),
      query: undefined,
    }
  }

  if (endpoint.querySchema && endpoint.bodySchema) {
    const compositeRequest = requestData as {
      body: unknown
      query: unknown
    }

    return {
      body: endpoint.bodySchema.parse(compositeRequest.body),
      params: undefined,
      query: endpoint.querySchema.parse(compositeRequest.query),
    }
  }

  if (endpoint.paramsSchema) {
    return {
      body: undefined,
      params: endpoint.paramsSchema.parse(requestData),
      query: undefined,
    }
  }

  if (endpoint.querySchema) {
    return {
      body: undefined,
      params: undefined,
      query: endpoint.querySchema.parse(requestData),
    }
  }

  return {
    body: endpoint.bodySchema?.parse(requestData),
    params: undefined,
    query: undefined,
  }
}

function buildEndpointUrl(path: string, params: unknown) {
  if (!path.includes(':')) {
    return path
  }

  if (!isRecord(params)) {
    throw new TypeError(
      `Endpoint path "${path}" requires params to be provided as an object`
    )
  }

  return path.replace(/:([A-Za-z0-9_]+)/g, (_, key: string) => {
    const value = params[key]

    if (value === undefined || value === null) {
      throw new TypeError(`Missing path param "${key}" for endpoint "${path}"`)
    }

    return encodeURIComponent(String(value))
  })
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}
