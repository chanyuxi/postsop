import { z } from 'zod'

import {
  PermissionMaskSchema,
  PermissionRegistryVersionSchema,
} from '@postsop/access-control'

export const AuthContextPayloadSchema = z.strictObject({
  pm: PermissionMaskSchema,
  pv: PermissionRegistryVersionSchema,
  sub: z.coerce.number().int().positive(),
  sid: z.string().min(1),
})

const JwtRegisteredClaimsSchema = z.strictObject({
  aud: z.union([z.string(), z.array(z.string())]).optional(),
  exp: z.number().int().optional(),
  iat: z.number().int().optional(),
  iss: z.string().optional(),
  jti: z.string().optional(),
  nbf: z.number().int().optional(),
})

export const ClaimsSchema = AuthContextPayloadSchema.extend(
  JwtRegisteredClaimsSchema.shape
)

export type AuthContextPayload = z.infer<typeof AuthContextPayloadSchema>
export type Claims = z.infer<typeof ClaimsSchema>
