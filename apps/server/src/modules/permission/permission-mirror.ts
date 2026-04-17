import type { PermissionRegistryEntry } from '@postsop/access-control/permissions'
import { permissionRegistry } from '@postsop/access-control/permissions'

interface PermissionMirrorRecord {
  _count: {
    roles: number
  }
  deprecated: boolean
  group: string
  id: number
  label: string
  name: string
}

interface PermissionMirrorReadClient {
  permission: {
    findMany(args: {
      orderBy: {
        name: 'asc'
      }
      select: {
        _count: {
          select: {
            roles: true
          }
        }
        deprecated: true
        group: true
        id: true
        label: true
        name: true
      }
    }): Promise<PermissionMirrorRecord[]>
  }
}

interface PermissionMirrorWriteClient extends PermissionMirrorReadClient {
  permission: PermissionMirrorReadClient['permission'] & {
    createMany(args: {
      data: {
        deprecated: boolean
        group: string
        label: string
        name: string
      }[]
    }): Promise<{ count: number }>
    deleteMany(args: {
      where: {
        id: {
          in: number[]
        }
      }
    }): Promise<{ count: number }>
    update(args: {
      data: {
        deprecated: boolean
        group: string
        label: string
      }
      where: {
        id: number
      }
    }): Promise<unknown>
  }
}

interface PermissionMirrorTransactionRunner {
  $transaction<T>(
    callback: (client: PermissionMirrorWriteClient) => Promise<T>,
  ): Promise<T>
}

export interface PermissionMirrorDbEntry {
  deprecated: boolean
  group: string
  id: number
  label: string
  name: string
  roleCount: number
}

export interface PermissionMirrorValueChange<T> {
  from: T
  to: T
}

export interface PermissionMirrorUpdate {
  changes: {
    deprecated?: PermissionMirrorValueChange<boolean>
    group?: PermissionMirrorValueChange<string>
    label?: PermissionMirrorValueChange<string>
  }
  dbPermission: PermissionMirrorDbEntry
  registryPermission: PermissionRegistryEntry
}

export interface PermissionMirrorDiff {
  changedPermissions: PermissionMirrorUpdate[]
  missingPermissions: PermissionRegistryEntry[]
  stalePermissions: PermissionMirrorDbEntry[]
  stalePermissionsInUse: PermissionMirrorDbEntry[]
}

export interface PermissionMirrorCheckResult {
  dbPermissions: PermissionMirrorDbEntry[]
  diff: PermissionMirrorDiff
}

export interface PermissionMirrorSyncResult extends PermissionMirrorCheckResult {
  createdPermissions: PermissionRegistryEntry[]
  deletedPermissions: PermissionMirrorDbEntry[]
  updatedPermissions: PermissionMirrorUpdate[]
}

export class PermissionMirrorSyncError extends Error {
  readonly diff: PermissionMirrorDiff

  constructor(diff: PermissionMirrorDiff) {
    super(formatPermissionMirrorSyncError(diff))
    this.name = 'PermissionMirrorSyncError'
    this.diff = diff
  }
}

export async function loadPermissionMirror(
  client: PermissionMirrorReadClient,
): Promise<PermissionMirrorDbEntry[]> {
  const permissions = await client.permission.findMany({
    orderBy: {
      name: 'asc',
    },
    select: {
      _count: {
        select: {
          roles: true,
        },
      },
      deprecated: true,
      group: true,
      id: true,
      label: true,
      name: true,
    },
  })

  return permissions.map((permission) => ({
    deprecated: permission.deprecated,
    group: permission.group,
    id: permission.id,
    label: permission.label,
    name: permission.name,
    roleCount: permission._count.roles,
  }))
}

export function diffPermissionMirror(
  dbPermissions: readonly PermissionMirrorDbEntry[],
  registryPermissions: readonly PermissionRegistryEntry[] = permissionRegistry,
): PermissionMirrorDiff {
  const registryByName = new Map<string, PermissionRegistryEntry>(
    registryPermissions.map(
      (permission) => [permission.name, permission] as const,
    ),
  )
  const changedPermissions: PermissionMirrorUpdate[] = []
  const stalePermissions: PermissionMirrorDbEntry[] = []
  const stalePermissionsInUse: PermissionMirrorDbEntry[] = []

  for (const dbPermission of sortByName(
    dbPermissions,
    (permission) => permission.name,
  )) {
    const registryPermission = registryByName.get(dbPermission.name)

    if (!registryPermission) {
      if (dbPermission.roleCount > 0) {
        stalePermissionsInUse.push(dbPermission)
      } else {
        stalePermissions.push(dbPermission)
      }

      continue
    }

    registryByName.delete(dbPermission.name)

    const changes: PermissionMirrorUpdate['changes'] = {}

    if (dbPermission.group !== registryPermission.group) {
      changes.group = {
        from: dbPermission.group,
        to: registryPermission.group,
      }
    }

    if (dbPermission.label !== registryPermission.label) {
      changes.label = {
        from: dbPermission.label,
        to: registryPermission.label,
      }
    }

    if (dbPermission.deprecated !== registryPermission.deprecated) {
      changes.deprecated = {
        from: dbPermission.deprecated,
        to: registryPermission.deprecated,
      }
    }

    if (Object.keys(changes).length > 0) {
      changedPermissions.push({
        changes,
        dbPermission,
        registryPermission,
      })
    }
  }

  return {
    changedPermissions: sortByName(
      changedPermissions,
      (permission) => permission.registryPermission.name,
    ),
    missingPermissions: sortByName(
      [...registryByName.values()],
      (permission) => permission.name,
    ),
    stalePermissions,
    stalePermissionsInUse,
  }
}

export function hasPermissionMirrorDrift(diff: PermissionMirrorDiff): boolean {
  return (
    diff.changedPermissions.length > 0 ||
    diff.missingPermissions.length > 0 ||
    diff.stalePermissions.length > 0 ||
    diff.stalePermissionsInUse.length > 0
  )
}

export function formatPermissionMirrorDiff(diff: PermissionMirrorDiff): string {
  if (!hasPermissionMirrorDrift(diff)) {
    return 'Permission mirror is in sync.'
  }

  const lines: string[] = []

  if (diff.missingPermissions.length > 0) {
    lines.push('Missing permissions:')

    for (const permission of diff.missingPermissions) {
      lines.push(
        `- ${permission.name} (group=${permission.group}, label=${permission.label}, deprecated=${permission.deprecated})`,
      )
    }
  }

  if (diff.changedPermissions.length > 0) {
    lines.push('Mismatched permission metadata:')

    for (const permission of diff.changedPermissions) {
      const changes = Object.entries(permission.changes)
        .map(
          ([field, change]) =>
            `${field}: ${JSON.stringify(change?.from)} -> ${JSON.stringify(change?.to)}`,
        )
        .join(', ')

      lines.push(`- ${permission.registryPermission.name} (${changes})`)
    }
  }

  if (diff.stalePermissions.length > 0) {
    lines.push('Stale permissions with no role assignments:')

    for (const permission of diff.stalePermissions) {
      lines.push(`- ${permission.name}`)
    }
  }

  if (diff.stalePermissionsInUse.length > 0) {
    lines.push('Unknown permissions still assigned to roles:')

    for (const permission of diff.stalePermissionsInUse) {
      lines.push(`- ${permission.name} (roleCount=${permission.roleCount})`)
    }
  }

  return lines.join('\n')
}

export async function checkPermissionMirror(
  client: PermissionMirrorReadClient,
  registryPermissions: readonly PermissionRegistryEntry[] = permissionRegistry,
): Promise<PermissionMirrorCheckResult> {
  const dbPermissions = await loadPermissionMirror(client)

  return {
    dbPermissions,
    diff: diffPermissionMirror(dbPermissions, registryPermissions),
  }
}

export async function syncPermissionMirror(
  client: PermissionMirrorTransactionRunner,
  registryPermissions: readonly PermissionRegistryEntry[] = permissionRegistry,
): Promise<PermissionMirrorSyncResult> {
  return client.$transaction(async (tx) => {
    const dbPermissions = await loadPermissionMirror(tx)
    const diff = diffPermissionMirror(dbPermissions, registryPermissions)

    if (diff.stalePermissionsInUse.length > 0) {
      throw new PermissionMirrorSyncError(diff)
    }

    if (diff.missingPermissions.length > 0) {
      await tx.permission.createMany({
        data: diff.missingPermissions.map((permission) => ({
          deprecated: permission.deprecated,
          group: permission.group,
          label: permission.label,
          name: permission.name,
        })),
      })
    }

    for (const permission of diff.changedPermissions) {
      await tx.permission.update({
        data: {
          deprecated: permission.registryPermission.deprecated,
          group: permission.registryPermission.group,
          label: permission.registryPermission.label,
        },
        where: {
          id: permission.dbPermission.id,
        },
      })
    }

    if (diff.stalePermissions.length > 0) {
      await tx.permission.deleteMany({
        where: {
          id: {
            in: diff.stalePermissions.map((permission) => permission.id),
          },
        },
      })
    }

    return {
      createdPermissions: diff.missingPermissions,
      dbPermissions,
      deletedPermissions: diff.stalePermissions,
      diff,
      updatedPermissions: diff.changedPermissions,
    }
  })
}

function formatPermissionMirrorSyncError(diff: PermissionMirrorDiff): string {
  const details = diff.stalePermissionsInUse
    .map(
      (permission) =>
        `- ${permission.name} (roleCount=${permission.roleCount})`,
    )
    .join('\n')

  return [
    'Cannot synchronize permission mirror because unknown permissions are still assigned to roles.',
    'Restore these permissions in code as deprecated or remove the role bindings first:',
    details,
  ].join('\n')
}

function sortByName<T>(items: readonly T[], getName: (item: T) => string): T[] {
  return [...items].sort((left, right) =>
    getName(left).localeCompare(getName(right)),
  )
}
