import { Injectable } from '@nestjs/common'

import { permissionNames } from '@postsop/access-control/permissions'
import type { AvailablePermissionNames } from '@postsop/contracts/permission'
import { AvailablePermissionNamesSchema } from '@postsop/contracts/permission'

import { PrismaService } from '@/database/prisma.service'

@Injectable()
export class PermissionService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAllPermissionNames(): Promise<AvailablePermissionNames> {
    return AvailablePermissionNamesSchema.parse(permissionNames)
  }

  async getUserPermissionNames(
    userId: number,
  ): Promise<AvailablePermissionNames> {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        roles: {
          select: {
            permissions: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    })

    const permissionNames = AvailablePermissionNamesSchema.parse([
      ...new Set(
        (user?.roles ?? []).flatMap((role) =>
          role.permissions.map((permission) => permission.name),
        ),
      ),
    ])

    return permissionNames
  }
}
