import { REACT_APP_API_URL } from '@env'
import { type ApiResponse, ResponseCode } from '@postsop/contracts/type'
import axios, {
  type AxiosError,
  type AxiosRequestConfig,
  type AxiosResponse,
} from 'axios'

import { ApiError } from './error'

const service = axios.create({
  baseURL: REACT_APP_API_URL,
  timeout: 5000,
})

// Request interceptor
service.interceptors.request.use(
  (config) => {
    config.headers['Content-Type'] = 'application/json'

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

    if (res.code !== ResponseCode.SUCCESS) {
      return Promise.reject(
        new ApiError(res.message, response.status, res.code)
      )
    }

    return response
  },
  (error: AxiosError<ApiResponse>) => {
    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      throw ApiError.timeout()
    }

    if (!error.response) {
      throw ApiError.network()
    }

    const { status, data } = error.response

    if (data?.code && data?.message) {
      throw new ApiError(data.message, status, data.code)
    }

    throw ApiError.http(status, error.message)
  }
)

// Typed request helpers
async function request<T>(config: AxiosRequestConfig): Promise<ApiResponse<T>> {
  const response = await service.request<ApiResponse<T>>(config)
  return response.data
}

export function get<T>(url: string, config?: AxiosRequestConfig) {
  return request<T>({ ...config, method: 'GET', url })
}

export function post<T>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig
) {
  return request<T>({ ...config, method: 'POST', url, data })
}

export function put<T>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig
) {
  return request<T>({ ...config, method: 'PUT', url, data })
}

export function patch<T>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig
) {
  return request<T>({ ...config, method: 'PATCH', url, data })
}

export function del<T>(url: string, config?: AxiosRequestConfig) {
  return request<T>({ ...config, method: 'DELETE', url })
}

export default service
