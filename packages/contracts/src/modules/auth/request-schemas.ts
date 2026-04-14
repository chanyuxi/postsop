import { z } from 'zod'

import { email, password } from '../../core'

export const SignInRequestSchema = z.strictObject({
  email,
  password,
})

export const SignUpRequestSchema = z.strictObject({
  email,
  password,
})

export const RefreshTokenRequestSchema = z.strictObject({
  refreshToken: z
    .string()
    .trim()
    .regex(/^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/, 'Invalid refresh token'),
})

export type SignInRequest = z.infer<typeof SignInRequestSchema>
export type SignUpRequest = z.infer<typeof SignUpRequestSchema>
export type RefreshTokenRequest = z.infer<typeof RefreshTokenRequestSchema>
