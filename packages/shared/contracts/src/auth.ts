import { z } from 'zod'

const EmailSchema = z.string().trim().toLowerCase().email()
const PasswordSchema = z.string().min(6)

export const SignInDto = z
  .object({
    email: EmailSchema,
    password: PasswordSchema,
  })
  .strict()

export type SignInDto = z.infer<typeof SignInDto>

export const SignUpDto = z
  .object({
    email: EmailSchema,
    password: PasswordSchema,
  })
  .strict()

export type SignUpDto = z.infer<typeof SignUpDto>

export const RefreshTokenDto = z
  .object({
    refreshToken: z
      .string()
      .trim()
      .regex(/^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/, 'Invalid refresh token'),
  })
  .strict()

export type RefreshTokenDto = z.infer<typeof RefreshTokenDto>

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
