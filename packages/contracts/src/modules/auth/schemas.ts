import { z } from 'zod'

import { email, password } from '../..'

export const SignInRequestSchema = z.strictObject({
  email,
  password,
})
export type SignInRequest = z.infer<typeof SignInRequestSchema>

export const SignUpRequestSchema = z.strictObject({
  email,
  password,
})
export type SignUpRequest = z.infer<typeof SignUpRequestSchema>

export const RefreshTokenRequestSchema = z.strictObject({
  refreshToken: z
    .string()
    .trim()
    .regex(/^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/, 'Invalid refresh token'),
})
export type RefreshTokenRequest = z.infer<typeof RefreshTokenRequestSchema>

export const RoleSummarySchema = z.strictObject({
  name: z.string(),
})
export type RoleSummary = z.infer<typeof RoleSummarySchema>

export const SessionUserSchema = z.strictObject({
  email: z.email(),
  id: z.number(),
  roles: z.array(RoleSummarySchema),
})
export type SessionUser = z.infer<typeof SessionUserSchema>

export const AuthTokensSchema = z.strictObject({
  accessToken: z.string(),
  refreshToken: z.string(),
})
export type AuthTokens = z.infer<typeof AuthTokensSchema>

export const AuthSessionSchema = z.strictObject({
  tokens: AuthTokensSchema,
  user: SessionUserSchema,
})
export type AuthSession = z.infer<typeof AuthSessionSchema>

export const SignInResponseSchema = AuthSessionSchema
export type SignInResponse = AuthSession

export const RefreshTokenResponseSchema = AuthSessionSchema
export type RefreshTokenResponse = AuthSession
