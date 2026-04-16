import { createMMKV } from 'react-native-mmkv'

import type { AuthSession } from '@postsop/contracts/auth'

import type { ThemeName } from './theme'

export const SYSTEM_THEME = 'system.theme'
export const AUTHORIZATION_ACCESS_TOKEN = 'authorization.access_token'
export const AUTHORIZATION_REFRESH_TOKEN = 'authorization.refresh_token'

export const storage = createMMKV()

export function persistTheme(theme: ThemeName) {
  storage.set(SYSTEM_THEME, theme)
}

export function getStoredTheme() {
  return storage.getString(SYSTEM_THEME) as ThemeName
}

export function persistAccessToken(accessToken: string) {
  storage.set(AUTHORIZATION_ACCESS_TOKEN, accessToken)
}

export function getStoredAccessToken() {
  return storage.getString(AUTHORIZATION_ACCESS_TOKEN)
}

export function persistRefreshToken(refreshToken: string) {
  storage.set(AUTHORIZATION_REFRESH_TOKEN, refreshToken)
}

export function getStoredRefreshToken() {
  return storage.getString(AUTHORIZATION_REFRESH_TOKEN)
}

export function persistAuthorization(authSession: AuthSession) {
  persistAccessToken(authSession.tokens.accessToken)
  persistRefreshToken(authSession.tokens.refreshToken)
}

export function clearStoredAuthSession() {
  storage.remove(AUTHORIZATION_ACCESS_TOKEN)
  storage.remove(AUTHORIZATION_REFRESH_TOKEN)
}
