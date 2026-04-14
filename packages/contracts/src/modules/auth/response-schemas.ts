import { z } from 'zod'

export const RoleSummarySchema = z.strictObject({
  name: z.string(),
})

export const SessionUserSchema = z.strictObject({
  email: z.email(),
  id: z.number(),
  roles: z.array(RoleSummarySchema),
})

export const AuthTokensSchema = z.strictObject({
  accessToken: z.string(),
  refreshToken: z.string(),
})

export const SignInResponseSchema = z.strictObject({
  tokens: AuthTokensSchema,
  user: SessionUserSchema,
})

export const RefreshTokenResponseSchema = AuthTokensSchema

export type RoleSummary = z.infer<typeof RoleSummarySchema>
export type SessionUser = z.infer<typeof SessionUserSchema>
export type AuthTokens = z.infer<typeof AuthTokensSchema>
export type SignInResponse = z.infer<typeof SignInResponseSchema>
export type RefreshTokenResponse = z.infer<typeof RefreshTokenResponseSchema>
