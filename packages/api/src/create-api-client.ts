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
import { ApiError, ApiResponse } from '@postsop/contracts/http'

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
  resolve: () => void
}

/**
 * Sends a request defined by a shared endpoint contract.
 */
interface ApiEndpointRequester {
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
 * Factory options for the shared API client.
 * All axios creation options are forwarded to both the bare and authenticated clients.
 */
export interface CreateApiClientOptions extends CreateAxiosDefaults {
  customizer: {
    /** Configure your config */
    configure?: (config: ApiClientRequestConfig) => void
    /** Return true to perform a refresh action in advance */
    isAccessTokenExpiringSoon?: () => boolean
    /**
     * This function is used for attaching accessToken. Note that this function ensures
     * that it runs after refreshAccessToken is successful, assuming that you can
     * already access the latest accessToken.
     */
    attachAccessToken: (config: ApiClientRequestConfig) => void
    /** Refresh your token here */
    onFetchTokens: (instance: AxiosInstance) => Promise<void>
  }
}

/**
 * Public API surface returned by `createApiClient`.
 */
export interface ApiClient {
  client: AxiosInstance
  request: <T = null, D = unknown>(
    config: ApiClientRequestConfig<D>
  ) => Promise<T>
  requestEndpoint: ApiEndpointRequester
}

/**
 * Creates a reusable API client with auth refresh support.
 */
export function createApiClient(options: CreateApiClientOptions): ApiClient {
  let refreshPromise: Promise<void> | null = null
  let requestQueue: RequestQueueEntry[] = []

  const { customizer, ...config } = options

  const client = axios.create(config)
  client.interceptors.request.use(
    async (config: RetryableRequestConfig) => {
      customizer.configure?.(config)

      if (config.skipAuthRefresh) {
        return config
      }

      if (refreshPromise) {
        return new Promise((resolve, reject) => {
          requestQueue.push({
            resolve: () => {
              customizer.attachAccessToken(config)
              resolve(config)
            },
            reject,
          })
        })
      }

      if (customizer.isAccessTokenExpiringSoon?.()) {
        await refreshAccessToken()
        customizer.attachAccessToken(config)
        return config
      }

      customizer.attachAccessToken(config)
      return config
    },
    (error) => {
      const normalizedError = normalizeUnknownError(error)

      throw normalizedError
    }
  )
  client.interceptors.response.use(undefined, async (error: unknown) => {
    const apiError = normalizeUnknownError(error)

    return processApiError(apiError, (error as AxiosError).config)
  })

  const bareClient = axios.create(config)
  bareClient.interceptors.request.use((config) => {
    customizer.configure?.(config)
    return config
  })

  const refreshAccessToken = async () => {
    if (refreshPromise) {
      return refreshPromise
    }

    refreshPromise = (async () => {
      try {
        await customizer.onFetchTokens(bareClient)

        flushRequestQueue(null)
      } catch (error) {
        const normalizedError = normalizeUnknownError(error)
        flushRequestQueue(normalizedError)

        throw normalizedError
      } finally {
        refreshPromise = null
      }
    })()

    return refreshPromise
  }

  const flushRequestQueue = (error: unknown) => {
    requestQueue.forEach(({ reject, resolve }) => {
      if (error) {
        reject(error)
        return
      }

      resolve()
    })

    requestQueue = []
  }

  const processApiError = async (
    error: ApiError,
    config?: RetryableRequestConfig
  ) => {
    if (config && !config.skipAuthRefresh && error.needsRefresh) {
      config._retryCount = (config._retryCount ?? 0) + 1

      if (config._retryCount > 1) {
        throw error
      }

      await refreshAccessToken()
      customizer.attachAccessToken(config)

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
    client,
    request,
    requestEndpoint,
  }
}

function normalizeUnknownError(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error
  }

  if (axios.isAxiosError(error)) {
    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      return ApiError.timeout()
    }

    if (!error.response) {
      return ApiError.network()
    }

    const { data, status } = error.response
    return new ApiError(data.message || error.message, status, data.code)
  }

  throw ApiError.configError((error as Error)?.message)
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
) {
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
  // In the future, we can implement this feature, depending on whether we need to enforce Restful style
  if (path.includes(':')) {
    throw new TypeError(
      `Endpoint path "${path}" cannot use path params. Use "params" for query strings or "data" for request bodies instead.`
    )
  }

  return path
}
