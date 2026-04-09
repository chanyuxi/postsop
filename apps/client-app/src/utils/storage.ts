import { createMMKV } from 'react-native-mmkv'

import type { SessionUser, SignInResult } from '@postsop/contracts/type'

import {
  AUTHORIZATION_USER_PROFILE,
  AUTHORIZATION_USER_REFRESH_TOKEN,
  AUTHORIZATION_USER_TOKEN,
  STRORAGE_KEY_THEME,
} from '@/constants/keys'

export const StrorageKeys = {
  THEME: STRORAGE_KEY_THEME,
  TOKEN: AUTHORIZATION_USER_TOKEN,
  REFRESH_TOKEN: AUTHORIZATION_USER_REFRESH_TOKEN,
  USER: AUTHORIZATION_USER_PROFILE,
}

export const storage = createMMKV()

export function getStoredAccessToken() {
  return storage.getString(StrorageKeys.TOKEN)
}

export function getStoredRefreshToken() {
  return storage.getString(StrorageKeys.REFRESH_TOKEN)
}

export function getStoredUser(): SessionUser | null {
  const rawUser = storage.getString(StrorageKeys.USER)

  if (!rawUser) {
    return null
  }

  try {
    return JSON.parse(rawUser) as SessionUser
  } catch {
    clearStoredAuthSession()
    return null
  }
}

export function persistAuthSession(authSession: SignInResult) {
  storage.set(StrorageKeys.TOKEN, authSession.tokens.accessToken)
  storage.set(StrorageKeys.REFRESH_TOKEN, authSession.tokens.refreshToken)
  storage.set(StrorageKeys.USER, JSON.stringify(authSession.user))
}

export function clearStoredAuthSession() {
  storage.remove(StrorageKeys.TOKEN)
  storage.remove(StrorageKeys.REFRESH_TOKEN)
  storage.remove(StrorageKeys.USER)
}
