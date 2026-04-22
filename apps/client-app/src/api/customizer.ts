import atob from 'atob'
import type { AxiosInstance } from 'axios'

import type {
  ApiClientRequestConfig,
  CreateApiClientOptions,
} from '@postsop/apis'
import type { RefreshTokenResponse } from '@postsop/contracts/auth'
import { refreshEndpoint } from '@postsop/contracts/auth'
import type { ApiResponse } from '@postsop/contracts/http'
import { ClientPlatform } from '@postsop/contracts/http'

import { APP_VERSION } from '@/constants'
import { applyAuthSession, clearAuthSession } from '@/services/auth/session'
import { getStoredAccessToken, getStoredRefreshToken } from '@/utils/storage'

function configure(config: ApiClientRequestConfig) {
  config.headers = {
    'Content-Type': 'application/json',

    'X-Postsop-Platform': ClientPlatform.App,
    'X-Postsop-V': APP_VERSION,
    ...config.headers,
  }
}

function isAccessTokenExpiringSoon() {
  const accessToken = getStoredAccessToken()

  if (!accessToken) {
    return true
  }

  try {
    const payload = JSON.parse(atob(accessToken.split('.')[1] ?? ''))
    const exp = payload.exp

    return typeof exp === 'number' && exp * 1000 - Date.now() < 60_000
  } catch {
    return true
  }
}

function attachAccessToken(config: ApiClientRequestConfig) {
  const accessToken = getStoredAccessToken()

  if (accessToken) {
    config.headers = {
      Authorization: `Bearer ${accessToken}`,
      ...config.headers,
    }
  }
}

async function onFetchTokens(instance: AxiosInstance) {
  const oldRefreshToken = getStoredRefreshToken()

  try {
    const response = await instance.request<ApiResponse<RefreshTokenResponse>>({
      method: refreshEndpoint.method,
      url: refreshEndpoint.path,
      data: { refreshToken: oldRefreshToken },
    })

    const authSession = refreshEndpoint.responseSchema.parse(response.data.data)
    applyAuthSession(authSession)
  } catch (error) {
    clearAuthSession()
    throw error
  }
}

export const customizer: CreateApiClientOptions['customizer'] = {
  configure,
  isAccessTokenExpiringSoon,
  attachAccessToken,
  onFetchTokens,
}
