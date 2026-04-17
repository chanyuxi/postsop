import { z } from 'zod'

export const permissionRegistryVersion = 1

export interface PermissionDefinition {
  deprecated?: boolean
  group: string
  label: string
}

interface PermissionRegistrySourceEntry extends PermissionDefinition {
  name: string
}

function definePermissionRegistry<
  const T extends readonly PermissionRegistrySourceEntry[],
>(registry: T) {
  return registry
}

const permissionRegistrySource = definePermissionRegistry([
  {
    group: 'user',
    label: 'Create user',
    name: 'create:user',
  },
  {
    group: 'user',
    label: 'Read user',
    name: 'read:user',
  },
  {
    group: 'user',
    label: 'Update user',
    name: 'update:user',
  },
  {
    group: 'user',
    label: 'Delete user',
    name: 'delete:user',
  },
])

export type PermissionName = (typeof permissionRegistrySource)[number]['name']
export type PermissionRegistryVersion = typeof permissionRegistryVersion

export interface PermissionRegistryEntry extends Omit<
  PermissionDefinition,
  'deprecated'
> {
  deprecated: boolean
  name: PermissionName
}

export const permissionRegistry = permissionRegistrySource.map(
  normalizePermissionRegistryEntry
) as readonly PermissionRegistryEntry[]

export const permissionNames = permissionRegistry.map(
  (permission) => permission.name
) as unknown as readonly [PermissionName, ...PermissionName[]]

export const PermissionNameSchema = z.enum(permissionNames)
export const PermissionRegistryVersionSchema = z.literal(
  permissionRegistryVersion
)

export const permissionDefinitions = Object.fromEntries(
  permissionRegistry.map(
    ({ name, ...definition }) => [name, definition] as const
  )
) as Record<PermissionName, PermissionDefinition>

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

function normalizePermissionRegistryEntry(
  permission: PermissionRegistrySourceEntry
): PermissionRegistryEntry {
  return {
    ...permission,
    deprecated: permission.deprecated ?? false,
    name: permission.name as PermissionName,
  }
}
