import { permissionRegistry } from '@postsop/access-control/permissions'

import {
  checkPermissionMirror,
  diffPermissionMirror,
  PermissionMirrorDbEntry,
  PermissionMirrorSyncError,
  syncPermissionMirror,
} from '@/modules/permission/permission-mirror'

type MutablePermissionMirrorRecord = PermissionMirrorDbEntry
type PermissionMirrorInsert = Pick<
  PermissionMirrorDbEntry,
  'deprecated' | 'group' | 'label' | 'name'
>

class FakePermissionMirrorClient {
  private nextId: number
  private permissions: MutablePermissionMirrorRecord[]

  readonly permission = {
    createMany: jest.fn(
      async ({ data }: { data: PermissionMirrorInsert[] }) => {
        for (const permission of data) {
          this.permissions.push({
            ...permission,
            id: this.nextId++,
            roleCount: 0,
          })
        }

        return {
          count: data.length,
        }
      },
    ),
    deleteMany: jest.fn(
      async ({
        where,
      }: {
        where: {
          id: {
            in: number[]
          }
        }
      }) => {
        const ids = new Set(where.id.in)
        const originalCount = this.permissions.length

        this.permissions = this.permissions.filter(
          (permission) => !ids.has(permission.id),
        )

        return {
          count: originalCount - this.permissions.length,
        }
      },
    ),
    findMany: jest.fn(async () =>
      this.permissions.map((permission) => ({
        _count: {
          roles: permission.roleCount,
        },
        deprecated: permission.deprecated,
        group: permission.group,
        id: permission.id,
        label: permission.label,
        name: permission.name,
      })),
    ),
    update: jest.fn(
      async ({
        data,
        where,
      }: {
        data: PermissionMirrorInsert
        where: {
          id: number
        }
      }) => {
        const permission = this.permissions.find(
          (entry) => entry.id === where.id,
        )

        if (!permission) {
          throw new Error(`Unknown permission id: ${where.id}`)
        }

        Object.assign(permission, data)

        return {
          ...permission,
        }
      },
    ),
  }

  constructor(initialPermissions: PermissionMirrorDbEntry[]) {
    this.permissions = initialPermissions.map((permission) => ({
      ...permission,
    }))
    this.nextId =
      Math.max(0, ...initialPermissions.map((permission) => permission.id)) + 1
  }

  async $transaction<T>(
    callback: (tx: FakePermissionMirrorClient) => Promise<T>,
  ): Promise<T> {
    return callback(this)
  }

  snapshot(): PermissionMirrorDbEntry[] {
    return [...this.permissions].sort((left, right) =>
      left.name.localeCompare(right.name),
    )
  }
}

const buildDbPermission = (
  name: string,
  overrides: Partial<PermissionMirrorDbEntry> = {},
): PermissionMirrorDbEntry => ({
  deprecated: false,
  group: 'user',
  id: overrides.id ?? 1,
  label: name,
  name,
  roleCount: 0,
  ...overrides,
})

describe('permission mirror', () => {
  it('detects missing, mismatched, stale, and stale-in-use permissions', async () => {
    const diff = diffPermissionMirror([
      buildDbPermission('create:user', {
        id: 1,
        label: 'Create user',
      }),
      buildDbPermission('read:user', {
        id: 2,
        label: 'Read user (legacy)',
      }),
      buildDbPermission('legacy:orphan', {
        id: 3,
        label: 'Legacy orphan',
      }),
      buildDbPermission('legacy:assigned', {
        id: 4,
        label: 'Legacy assigned',
        roleCount: 2,
      }),
    ])

    expect(
      diff.missingPermissions.map((permission) => permission.name),
    ).toEqual(['delete:user', 'update:user'])
    expect(
      diff.changedPermissions.map(
        (permission) => permission.registryPermission.name,
      ),
    ).toEqual(['read:user'])
    expect(diff.stalePermissions.map((permission) => permission.name)).toEqual([
      'legacy:orphan',
    ])
    expect(
      diff.stalePermissionsInUse.map((permission) => permission.name),
    ).toEqual(['legacy:assigned'])
  })

  it('synchronizes missing permissions, metadata mismatches, and stale records', async () => {
    const client = new FakePermissionMirrorClient([
      buildDbPermission('read:user', {
        id: 1,
        label: 'Read user (legacy)',
      }),
      buildDbPermission('legacy:orphan', {
        id: 2,
        label: 'Legacy orphan',
      }),
    ])

    const result = await syncPermissionMirror(client)

    expect(
      result.createdPermissions.map((permission) => permission.name),
    ).toEqual(['create:user', 'delete:user', 'update:user'])
    expect(
      result.updatedPermissions.map(
        (permission) => permission.registryPermission.name,
      ),
    ).toEqual(['read:user'])
    expect(
      result.deletedPermissions.map((permission) => permission.name),
    ).toEqual(['legacy:orphan'])
    expect(client.snapshot().map((permission) => permission.name)).toEqual(
      permissionRegistry.map((permission) => permission.name).sort(),
    )
    expect(
      client.snapshot().find((permission) => permission.name === 'read:user'),
    ).toMatchObject({
      label: 'Read user',
    })
  })

  it('is idempotent when the database mirror already matches the registry', async () => {
    const client = new FakePermissionMirrorClient(
      permissionRegistry.map((permission, index) => ({
        ...permission,
        id: index + 1,
        roleCount: 0,
      })),
    )

    const checkResult = await checkPermissionMirror(client)
    const syncResult = await syncPermissionMirror(client)

    expect(checkResult.diff).toEqual({
      changedPermissions: [],
      missingPermissions: [],
      stalePermissions: [],
      stalePermissionsInUse: [],
    })
    expect(syncResult.createdPermissions).toEqual([])
    expect(syncResult.updatedPermissions).toEqual([])
    expect(syncResult.deletedPermissions).toEqual([])
  })

  it('refuses to delete unknown permissions that are still assigned to roles', async () => {
    const client = new FakePermissionMirrorClient([
      buildDbPermission('legacy:assigned', {
        id: 1,
        label: 'Legacy assigned',
        roleCount: 1,
      }),
    ])
    const snapshotBefore = client.snapshot()

    await expect(syncPermissionMirror(client)).rejects.toBeInstanceOf(
      PermissionMirrorSyncError,
    )
    expect(client.snapshot()).toEqual(snapshotBefore)
  })
})
