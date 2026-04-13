import { z } from 'zod'

export const RoleSummarySchema = z
  .object({
    name: z.string(),
  })
  .strict()

export const SessionUserSchema = z
  .object({
    email: z.email(),
    id: z.number(),
    roles: z.array(RoleSummarySchema),
  })
  .strict()

export const AuthTokensSchema = z
  .object({
    accessToken: z.string(),
    refreshToken: z.string(),
  })
  .strict()

export const SignInResultSchema = z
  .object({
    tokens: AuthTokensSchema,
    user: SessionUserSchema,
  })
  .strict()

export const RefreshTokenResultSchema = AuthTokensSchema

export type RoleSummary = z.infer<typeof RoleSummarySchema>
export type SessionUser = z.infer<typeof SessionUserSchema>
export type AuthTokens = z.infer<typeof AuthTokensSchema>
export type SignInResult = z.infer<typeof SignInResultSchema>
export type RefreshTokenResult = z.infer<typeof RefreshTokenResultSchema>
