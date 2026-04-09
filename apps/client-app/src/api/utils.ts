import type { InternalAxiosRequestConfig } from 'axios'

export function injectAuthenticationInformation(
  config: InternalAxiosRequestConfig,
  accessToken: string
) {
  config.headers.Authorization = `Bearer ${accessToken}`
}

export function assemblyMessage(rawMessage: string | string[] | undefined) {
  const message =
    typeof rawMessage === 'string'
      ? rawMessage
      : Array.isArray(rawMessage)
        ? rawMessage.join(', ')
        : undefined

  return message
}
