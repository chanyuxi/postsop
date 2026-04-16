import { z } from 'zod'

export const permissionNames = [
  'create:user',
  'read:user',
  'update:user',
  'delete:user',
] as const

export const PermissionNameSchema = z.enum(permissionNames)
export type PermissionName = z.infer<typeof PermissionNameSchema>
