import { z } from 'zod'

export const permissionRegistryVersion = 1

export const permissionNames = [
  'create:user',
  'read:user',
  'update:user',
  'delete:user',
] as const

export const PermissionNameSchema = z.enum(permissionNames)
export const PermissionRegistryVersionSchema = z.literal(
  permissionRegistryVersion
)

export type PermissionName = z.infer<typeof PermissionNameSchema>
export type PermissionRegistryVersion = typeof permissionRegistryVersion

export interface PermissionDefinition {
  deprecated?: boolean
  group: string
  label: string
}

export const permissionDefinitions = {
  'create:user': {
    group: 'user',
    label: 'Create user',
  },
  'delete:user': {
    group: 'user',
    label: 'Delete user',
  },
  'read:user': {
    group: 'user',
    label: 'Read user',
  },
  'update:user': {
    group: 'user',
    label: 'Update user',
  },
} satisfies Record<PermissionName, PermissionDefinition>

export const permissionCount = permissionNames.length

const permissionIndexMap = new Map<PermissionName, number>(
  permissionNames.map((permission, index) => [permission, index] as const)
)

export function getPermissionIndex(permission: PermissionName): number {
  const index = permissionIndexMap.get(permission)

  if (index === undefined) {
    throw new Error(`Unknown permission: ${permission}`)
  }

  return index
}
