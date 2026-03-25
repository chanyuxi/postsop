export interface RoleSummary {
  name: string
}

export interface SessionUser {
  id: number
  email: string
  roles: RoleSummary[]
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface SignInResult {
  tokens: AuthTokens
  user: SessionUser
}

export type RefreshTokenResult = AuthTokens
