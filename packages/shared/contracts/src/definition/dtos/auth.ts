import { z } from 'zod'

export const SignInDto = z
  .object({
    email: z.email(),
    password: z.string().min(6),
  })
  .strict()

export type SignInDto = z.infer<typeof SignInDto>

export const SignUpDto = z
  .object({
    email: z.email(),
    password: z.string().min(6),
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
