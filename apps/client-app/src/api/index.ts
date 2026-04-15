import { REACT_APP_API_TIMEOUT, REACT_APP_API_URL } from '@env'

import type { ApiClientRequestConfig, ApiResponse } from '@postsop/apis'
import {
  ApiError,
  attachBearerToken,
  ClientPlatform,
  configureJsonHeaders,
  createApiClient,
  InternalStatusCodes,
} from '@postsop/apis'
import type { RefreshTokenResponse } from '@postsop/contracts/auth'
import { refreshTokenEndpoint } from '@postsop/contracts/auth'

import { APP_VERSION } from '@/constants'
import { applyAuthSession, clearAuthSession } from '@/services/auth/session'
import { getStoredAccessToken, getStoredRefreshToken } from '@/utils/storage'

import { isTokenExpiringSoon } from './utils'

export type AppRequestConfig<D = unknown> = ApiClientRequestConfig<D>

const apiClient = createApiClient({
  authentication: {
    authAttacher: attachBearerToken,
    getAccessToken: getStoredAccessToken,
    getRefreshToken: getStoredRefreshToken,
    isTokenExpiringSoon,
    onRefreshFailure: clearAuthSession,
    refreshAccessToken: async (bareClient, refreshToken) => {
      const response = await bareClient.request<
        ApiResponse<RefreshTokenResponse>
      >({
        data: {
          refreshToken,
        },
        method: refreshTokenEndpoint.method,
        url: refreshTokenEndpoint.path,
      })

      if (response.data.code !== InternalStatusCodes.SUCCESS) {
        throw ApiError.internal(response.data.code, response.data.message)
      }

      const authSession = refreshTokenEndpoint.responseSchema.parse(
        response.data.data
      )

      applyAuthSession(authSession)

      return authSession.tokens
    },
    shouldSkipAuthRefresh: (config) => !!config.skipAuthRefresh,
  },
  baseURL: REACT_APP_API_URL,
  configureHeaders: configureJsonHeaders,
  headers: {
    'X-Postsop-Platform': ClientPlatform.App,
    'X-Postsop-V': APP_VERSION,
  },
  timeout: Number(REACT_APP_API_TIMEOUT) || 10000,
})

export const del: typeof apiClient.del = apiClient.del
export const get: typeof apiClient.get = apiClient.get
export const patch: typeof apiClient.patch = apiClient.patch
export const post: typeof apiClient.post = apiClient.post
export const put: typeof apiClient.put = apiClient.put
export const request: typeof apiClient.request = apiClient.request
export const requestEndpoint: typeof apiClient.requestEndpoint =
  apiClient.requestEndpoint

export default apiClient.client
