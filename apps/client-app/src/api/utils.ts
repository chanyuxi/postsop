import atob from 'atob'

export function isTokenExpiringSoon(token?: string | null): boolean {
  if (!token) {
    return false
  }

  try {
    const payload = JSON.parse(atob(token.split('.')[1] ?? ''))
    const exp = payload.exp

    return typeof exp === 'number' && exp * 1000 - Date.now() < 60_000
  } catch {
    return false
  }
}
