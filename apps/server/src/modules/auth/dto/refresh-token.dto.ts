import { z } from 'zod'

export const RefreshTokenDto = z
  .object({
    refreshToken: z
      .string()
      .trim()
      .regex(/^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/, 'Invalid refresh token'),
  })
  .strict()

export type RefreshTokenDto = z.infer<typeof RefreshTokenDto>
