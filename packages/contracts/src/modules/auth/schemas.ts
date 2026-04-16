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

export const RefreshRequestSchema = z.strictObject({
  refreshToken: z
    .string()
    .trim()
    .regex(/^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/, 'Invalid refresh token'),
})
export type RefreshRequest = z.infer<typeof RefreshRequestSchema>

export const AuthTokensSchema = z.strictObject({
  accessToken: z.string(),
  refreshToken: z.string(),
})
export type AuthTokens = z.infer<typeof AuthTokensSchema>

export const AuthSessionSchema = z.strictObject({
  tokens: AuthTokensSchema,
})
export type AuthSession = z.infer<typeof AuthSessionSchema>

export const SignInResponseSchema = AuthSessionSchema
export type SignInResponse = AuthSession

export const RefreshResponseSchema = AuthSessionSchema
export type RefreshTokenResponse = AuthSession
