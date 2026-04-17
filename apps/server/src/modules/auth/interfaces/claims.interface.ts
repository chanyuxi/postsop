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

export type AuthContextPayload = z.infer<typeof AuthContextPayloadSchema>

export function parseAuthContextPayload(payload: unknown): AuthContextPayload {
  return AuthContextPayloadSchema.parse(payload)
}
