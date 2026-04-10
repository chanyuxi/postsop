import { z } from 'zod'

import { email, password } from '../shared'

export const SignInSchema = z
  .object({
    email,
    password,
  })
  .strict()

export const SignUpSchema = z
  .object({
    email,
    password,
  })
  .strict()

export const RefreshTokenSchema = z
  .object({
    refreshToken: z
      .string()
      .trim()
      .regex(/^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/, 'Invalid refresh token'),
  })
  .strict()

export type SignInSchema = z.infer<typeof SignInSchema>
export type SignUpSchema = z.infer<typeof SignUpSchema>
export type RefreshTokenSchema = z.infer<typeof RefreshTokenSchema>
