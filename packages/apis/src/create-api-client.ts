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

type AnyApiEndpoint = ApiEndpoint<unknown, unknown>
type ApiEndpointResult<TEndpoint extends AnyApiEndpoint> =
  TEndpoint extends ApiEndpoint<unknown, infer TResponse> ? TResponse : never

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
  <TEndpoint extends ApiEndpoint<undefined, unknown>>(
    endpoint: TEndpoint,
    config?: ApiClientRequestConfig
  ): Promise<ApiEndpointResult<TEndpoint>>
  <TRequest, TEndpoint extends ApiEndpoint<TRequest, unknown>>(
    endpoint: TEndpoint,
    requestData: TRequest,
    config?: ApiClientRequestConfig
  ): Promise<ApiEndpointResult<TEndpoint>>
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

  const bareRequestEndpoint: ApiEndpointRequester = async <TRequest, TResponse>(
    endpoint: ApiEndpoint<TRequest, TResponse>,
    requestDataOrConfig?: ApiClientRequestConfig | TRequest,
    maybeConfig?: ApiClientRequestConfig
  ): Promise<TResponse> => {
    const { config, requestData } = resolveEndpointRequestArguments(
      endpoint,
      requestDataOrConfig,
      maybeConfig
    )
    const responseData = await bareRequest<TResponse>({
      ...config,
      data: requestData,
      method: endpoint.method,
      skipAuthRefresh: endpoint.skipAuthRefresh ?? config?.skipAuthRefresh,
      url: endpoint.path,
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
    requestEndpoint: async <TRequest, TResponse>(
      endpoint: ApiEndpoint<TRequest, TResponse>,
      requestDataOrConfig?: ApiClientRequestConfig | TRequest,
      maybeConfig?: ApiClientRequestConfig
    ) => {
      const { config, requestData } = resolveEndpointRequestArguments(
        endpoint,
        requestDataOrConfig,
        maybeConfig
      )
      const responseData = await request<TResponse>({
        ...config,
        data: requestData,
        method: endpoint.method,
        skipAuthRefresh: endpoint.skipAuthRefresh ?? config?.skipAuthRefresh,
        url: endpoint.path,
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

function parseEndpointResponse<TRequest, TResponse>(
  endpoint: ApiEndpoint<TRequest, TResponse>,
  responseData: TResponse
) {
  if (!endpoint.responseSchema) {
    return responseData
  }

  return endpoint.responseSchema.parse(responseData) as TResponse
}

function resolveEndpointRequestArguments<TRequest, TResponse>(
  endpoint: ApiEndpoint<TRequest, TResponse>,
  requestDataOrConfig?: ApiClientRequestConfig | TRequest,
  maybeConfig?: ApiClientRequestConfig
) {
  if (endpoint.requestSchema) {
    return {
      config: maybeConfig,
      requestData: endpoint.requestSchema.parse(requestDataOrConfig),
    }
  }

  return {
    config: requestDataOrConfig as ApiClientRequestConfig | undefined,
    requestData: undefined,
  }
}
