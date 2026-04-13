import { REACT_APP_API_TIMEOUT, REACT_APP_API_URL } from '@env'

import type { ApiClientRequestConfig } from '@postsop/apis'
import {
  ApiError,
  attachBearerToken,
  ClientPlatform,
  configureJsonHeaders,
  createApiClient,
} from '@postsop/apis'
import { authEndpoints } from '@postsop/contracts/endpoints'

import { APP_VERSION } from '@/constants'
import { clearAuthSession } from '@/services/auth/session'
import {
  getStoredAccessToken,
  getStoredRefreshToken,
  getStoredUser,
  persistAuthTokens,
} from '@/utils/storage'

import { isTokenExpiringSoon } from './utils'

export type AppRequestConfig<D = unknown> = ApiClientRequestConfig<D>

const apiClient = createApiClient({
  auth: {
    attachAccessToken: attachBearerToken,
    getAccessToken: getStoredAccessToken,
    getRefreshToken: getStoredRefreshToken,
    isTokenExpiringSoon,
    onRefreshFailure: clearAuthSession,
    onRefreshSuccess: (tokens) => {
      const refreshToken = tokens.refreshToken ?? getStoredRefreshToken()

      if (!refreshToken || !getStoredUser()) {
        throw ApiError.http(401, 'Session cleared')
      }

      persistAuthTokens({
        accessToken: tokens.accessToken,
        refreshToken,
      })
    },
    refreshAccessToken: ({ bareRequestEndpoint, refreshToken }) =>
      bareRequestEndpoint(authEndpoints.refreshToken, {
        refreshToken,
      }),
    shouldSkipAuthRefresh: (config) => !!config.skipAuthRefresh,
  },
  baseURL: REACT_APP_API_URL,
  configureHeaders: configureJsonHeaders,
  defaultHeaders: {
    'X-Postsop-Platform': ClientPlatform.App,
    'X-Postsop-V': APP_VERSION,
  },
  timeout: Number(REACT_APP_API_TIMEOUT) || 10000,
})

export const { del, get, patch, post, put, request, requestEndpoint } =
  apiClient

export default apiClient.client
