import {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  CreateAxiosDefaults,
  default as axios,
  InternalAxiosRequestConfig,
} from 'axios'

import type {
  AnyApiEndpoint,
  ApiEndpoint,
  ApiEndpointRequest,
  ApiEndpointResponse,
} from '@postsop/contracts'
import {
  ApiError,
  ApiResponse,
  Codes,
  StatusCodes,
} from '@postsop/contracts/http'
import { MaybePromise } from '@postsop/types'

/**
 * Axios request config used by the shared API client.
 * The extra flag allows individual requests to opt out of auth refresh logic.
 */
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

interface ResolvedEndpointRequest {
  data: unknown
  config?: ApiClientRequestConfig
  params: unknown
  url: string
}

/**
 * Sends a request defined by a shared endpoint contract.
 */
export interface ApiEndpointRequester {
  <TEndpoint extends ApiEndpoint<undefined, undefined, unknown>>(
    endpoint: TEndpoint,
    config?: ApiClientRequestConfig
  ): Promise<ApiEndpointResponse<TEndpoint>>
  <TEndpoint extends AnyApiEndpoint>(
    endpoint: TEndpoint,
    requestData: ApiEndpointRequest<TEndpoint>,
    config?: ApiClientRequestConfig
  ): Promise<ApiEndpointResponse<TEndpoint>>
}

/**
 * Tokens returned after a successful refresh.
 */
export interface ApiClientAuthRefreshResult {
  accessToken: string
  refreshToken?: string
}

/**
 * Factory options for the shared API client.
 * All axios creation options are forwarded to both the bare and authenticated clients.
 */
export interface CreateApiClientOptions extends CreateAxiosDefaults {
  configureHeaders?: (config: InternalAxiosRequestConfig) => void
  authentication?: ApiClientAuthenticationOptions
}

/**
 * Strategy hooks used to attach credentials and refresh access tokens.
 */
export interface ApiClientAuthenticationOptions {
  shouldSkipAuthRefresh?: (
    config: ApiClientRequestConfig | RetryableRequestConfig
  ) => boolean
  authAttacher?: (
    config: InternalAxiosRequestConfig,
    accessToken: string | undefined
  ) => void
  getAccessToken: () => MaybePromise<string | undefined>
  getRefreshToken: () => MaybePromise<string | undefined>
  isTokenExpiringSoon?: (accessToken: string | undefined) => boolean
  onRefreshFailure?: (error: ApiError) => MaybePromise<void>
  refreshAccessToken: (
    axios: AxiosInstance,
    oldRefreshToken: string
  ) => MaybePromise<ApiClientAuthRefreshResult>
  onRefreshSuccess?: (
    refreshedAuth: ApiClientAuthRefreshResult
  ) => MaybePromise<void>
}

/**
 * Public API surface returned by `createApiClient`.
 */
export interface ApiClient {
  bareClient: AxiosInstance
  client: AxiosInstance
  del: <T = null>(url: string, config?: ApiClientRequestConfig) => Promise<T>
  get: <T = null>(url: string, config?: ApiClientRequestConfig) => Promise<T>
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
  request: <T = null, D = unknown>(
    config: ApiClientRequestConfig<D>
  ) => Promise<T>
  requestEndpoint: ApiEndpointRequester
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
  const [createOptions, settings] = normalizeCreateApiClientOptions(options)

  const bareClient = axios.create(createOptions)
  const client = axios.create(createOptions)

  let refreshPromise: Promise<string> | null = null
  let requestQueue: RequestQueueEntry[] = []

  const auth = settings.authentication

  bareClient.interceptors.request.use((config) => {
    settings.configureHeaders?.(config)

    return config
  })

  client.interceptors.request.use(async (config: RetryableRequestConfig) => {
    settings.configureHeaders?.(config)

    if (!auth) {
      return config
    }

    const attacher = getAuthAttacher(auth)

    if (refreshPromise && !isAuthRefreshSkipped(auth, config)) {
      return new Promise((resolve, reject) => {
        requestQueue.push({
          resolve: (token) => {
            attacher(config, token)
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
      attacher(config, nextAccessToken)
      return config
    }

    attacher(config, accessToken)
    return config
  })

  client.interceptors.response.use(
    (response) => {
      if (response.data.code !== Codes.SUCCESS) {
        throw ApiError.code(response.data.code, response.data.message)
      }

      return response
    },
    async (error: AxiosError<{ code?: number; message?: string }>) => {
      const apiError = normalizeAxiosError(error)

      return processApiError(
        apiError,
        error.config as RetryableRequestConfig | undefined
      )
    }
  )

  const refreshAccessToken = async () => {
    if (refreshPromise) {
      return refreshPromise
    }

    refreshPromise = (async () => {
      const refreshToken = await auth!.getRefreshToken()

      if (!refreshToken) {
        const error = ApiError.http(
          StatusCodes.UNAUTHORIZED,
          'Missing refresh token'
        )

        await auth?.onRefreshFailure?.(error)
        flushRequestQueue(error)
        throw error
      }

      try {
        const refreshedAuth = await auth!.refreshAccessToken(
          bareClient,
          refreshToken
        )
        await auth?.onRefreshSuccess?.(refreshedAuth)
        flushRequestQueue(null, refreshedAuth.accessToken)

        return refreshedAuth.accessToken
      } catch (error) {
        // Refresh hooks may throw raw errors, so normalize them before handing
        // them back to the caller's refresh failure handler.
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

  const flushRequestQueue = (error: unknown, token?: string) => {
    requestQueue.forEach(({ reject, resolve }) => {
      if (error) {
        reject(error)
        return
      }

      resolve(token!)
    })

    requestQueue = []
  }

  const processApiError = async (
    error: ApiError,
    config?: RetryableRequestConfig
  ) => {
    if (
      auth &&
      config &&
      error.needsRefresh &&
      !isAuthRefreshSkipped(auth, config)
    ) {
      config._retryCount = (config._retryCount ?? 0) + 1

      if (config._retryCount > 1) {
        await auth.onRefreshFailure?.(error)
        throw error
      }

      const nextAccessToken = await refreshAccessToken()

      getAuthAttacher(auth)(config, nextAccessToken)

      return client.request(config)
    }

    throw error
  }

  const request = async <T = null, D = unknown>(
    config: ApiClientRequestConfig<D>
  ): Promise<T> => {
    const response = await client.request<ApiResponse<T>>(config)
    return response.data.data
  }

  const requestEndpoint: ApiEndpointRequester = async <
    TEndpoint extends AnyApiEndpoint,
  >(
    endpoint: TEndpoint,
    requestDataOrConfig?:
      | ApiClientRequestConfig
      | ApiEndpointRequest<TEndpoint>,
    maybeConfig?: ApiClientRequestConfig
  ): Promise<ApiEndpointResponse<TEndpoint>> => {
    const { config, data, params, url } = resolveEndpointRequestArguments(
      endpoint,
      requestDataOrConfig,
      maybeConfig
    )
    const responseData = await request<ApiEndpointResponse<TEndpoint>>({
      ...config,
      data,
      method: endpoint.method,
      params,
      skipAuthRefresh: endpoint.skipAuthRefresh ?? config?.skipAuthRefresh,
      url,
    })

    return parseEndpointResponse(endpoint, responseData)
  }

  return {
    bareClient,
    client,
    del: (url, config) => request({ ...config, method: 'DELETE', url }),
    get: (url, config) => request({ ...config, method: 'GET', url }),
    patch: (url, data, config) =>
      request({ ...config, data, method: 'PATCH', url }),
    post: (url, data, config) =>
      request({ ...config, data, method: 'POST', url }),
    put: (url, data, config) =>
      request({ ...config, data, method: 'PUT', url }),
    request,
    requestEndpoint,
  }
}

function normalizeCreateApiClientOptions(options: CreateApiClientOptions) {
  const { authentication, configureHeaders, ...createOptions } = options

  const settings = {
    authentication,
    configureHeaders,
  }

  return [createOptions, settings] as const
}

function isAuthRefreshSkipped(
  auth: ApiClientAuthenticationOptions,
  config: ApiClientRequestConfig | RetryableRequestConfig
) {
  return auth.shouldSkipAuthRefresh?.(config) ?? false
}

function getAuthAttacher(auth: ApiClientAuthenticationOptions) {
  return auth.authAttacher ?? attachBearerToken
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

function normalizeUnknownError(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error
  }

  if (axios.isAxiosError(error)) {
    return normalizeAxiosError(error)
  }

  throw error
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

function parseEndpointResponse<TEndpoint extends AnyApiEndpoint>(
  endpoint: TEndpoint,
  responseData: ApiEndpointResponse<TEndpoint>
) {
  return endpoint.responseSchema.parse(
    responseData
  ) as ApiEndpointResponse<TEndpoint>
}

function resolveEndpointRequestArguments<TEndpoint extends AnyApiEndpoint>(
  endpoint: TEndpoint,
  requestDataOrConfig?: ApiClientRequestConfig | ApiEndpointRequest<TEndpoint>,
  maybeConfig?: ApiClientRequestConfig
): ResolvedEndpointRequest {
  if (!hasEndpointRequest(endpoint)) {
    return {
      data: undefined,
      config: requestDataOrConfig as ApiClientRequestConfig | undefined,
      params: undefined,
      url: normalizeEndpointUrl(endpoint.path),
    }
  }

  const { data, params } = parseEndpointRequest(
    endpoint,
    (requestDataOrConfig ?? {}) as ApiEndpointRequest<TEndpoint>
  )

  return {
    data,
    config: maybeConfig,
    params,
    url: normalizeEndpointUrl(endpoint.path),
  }
}

function hasEndpointRequest(endpoint: AnyApiEndpoint) {
  return !!(endpoint.dataSchema || endpoint.paramsSchema)
}

function parseEndpointRequest<TEndpoint extends AnyApiEndpoint>(
  endpoint: TEndpoint,
  requestData: ApiEndpointRequest<TEndpoint>
) {
  const requestParts = requestData as Partial<
    Record<'data' | 'params', unknown>
  >

  return {
    data: endpoint.dataSchema?.parse(requestParts.data),
    params: endpoint.paramsSchema?.parse(requestParts.params),
  }
}

function normalizeEndpointUrl(path: string) {
  if (path.includes(':')) {
    throw new TypeError(
      `Endpoint path "${path}" cannot use path params. Use "params" for query strings or "data" for request bodies instead.`
    )
  }

  return path
}
