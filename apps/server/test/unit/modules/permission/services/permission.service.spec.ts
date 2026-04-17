import { permissionNames } from '@postsop/access-control/permissions'

import { PermissionService } from '@/modules/permission/services/permission.service'

jest.mock('@/database/prisma.service', () => ({
  PrismaService: class PrismaService {},
}))

describe('PermissionService', () => {
  const prismaService = {
    permission: {
      findMany: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
    },
  }

  let service: PermissionService

  beforeEach(() => {
    jest.clearAllMocks()
    service = new PermissionService(prismaService as never)
  })

  it('returns available permission names from the code registry', async () => {
    await expect(service.findAllPermissionNames()).resolves.toEqual(
      permissionNames,
    )
    expect(prismaService.permission.findMany).not.toHaveBeenCalled()
  })

  it('rejects unknown permission names loaded from role bindings', async () => {
    prismaService.user.findUnique = jest.fn().mockResolvedValue({
      roles: [
        {
          permissions: [{ name: 'read:user' }, { name: 'legacy:unknown' }],
        },
      ],
    })

    await expect(service.getUserPermissionNames(1)).rejects.toThrow()
  })
})
