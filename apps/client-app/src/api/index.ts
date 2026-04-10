import { REACT_APP_API_URL } from '@env'
import type { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import axios from 'axios'

import type { ApiResponse } from '@postsop/contracts/types'
import { ResponseStatus } from '@postsop/contracts/types'

import { getStoredAccessToken } from '@/utils/storage'

import { ApiError } from './error'
import { assemblyMessage, injectAuthenticationInformation } from './utils'

const service = axios.create({
  baseURL: REACT_APP_API_URL,
  timeout: 5000,
})

// Request interceptor
service.interceptors.request.use(
  (config) => {
    config.headers['Content-Type'] = 'application/json'

    const accessToken = getStoredAccessToken()
    if (accessToken) {
      injectAuthenticationInformation(config, accessToken)
    }

    return config
  },
  (error: AxiosError) => {
    console.warn(
      'Attempt to build or initiate request failed:',
      error.message || error
    )
    return Promise.reject(error)
  }
)

// Response interceptor
service.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    const res = response.data

    if (res.code !== ResponseStatus.SUCCESS) {
      return Promise.reject(
        new ApiError(res.message, response.status, res.code)
      )
    }

    return response
  },
  (error: AxiosError<{ code?: number; message?: string | string[] }>) => {
    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      throw ApiError.timeout()
    }

    if (!error.response) {
      throw ApiError.network()
    }

    const { status, data } = error.response

    if (data?.code && typeof data.message === 'string') {
      throw new ApiError(data.message, status, data.code)
    }

    const message = assemblyMessage(data?.message)

    if (message) {
      throw ApiError.http(status, message)
    }

    throw ApiError.http(status, error.message)
  }
)

// Typed request helpers
async function request<T = null>(config: AxiosRequestConfig): Promise<T> {
  const response = await service.request<ApiResponse<T>>(config)

  const { data: internalResponse } = response
  const { data } = internalResponse

  return data
}

export function get<T = null>(url: string, config?: AxiosRequestConfig) {
  return request<T>({ ...config, method: 'GET', url })
}

export function post<T = null>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig
) {
  return request<T>({ ...config, method: 'POST', url, data })
}

export function put<T = null>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig
) {
  return request<T>({ ...config, method: 'PUT', url, data })
}

export function patch<T = null>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig
) {
  return request<T>({ ...config, method: 'PATCH', url, data })
}

export function del<T = null>(url: string, config?: AxiosRequestConfig) {
  return request<T>({ ...config, method: 'DELETE', url })
}

export default service
