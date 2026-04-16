import type { Cache } from '@nestjs/cache-manager'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Inject, Injectable } from '@nestjs/common'

import type { AvailablePermissionNames } from '@postsop/contracts/permission'
import { AvailablePermissionNamesSchema } from '@postsop/contracts/permission'

import { PrismaService } from '@/database/prisma.service'

@Injectable()
export class PermissionService {
  private static readonly AVAILABLE_PERMISSIONS_CACHE_KEY = 'perm:all'
  private static readonly AVAILABLE_PERMISSIONS_TTL = 60 * 60 * 1000

  constructor(
    private readonly prismaService: PrismaService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async findAllPermissionNames(): Promise<AvailablePermissionNames> {
    const cachedPermissions =
      await this.cacheManager.get<AvailablePermissionNames>(
        PermissionService.AVAILABLE_PERMISSIONS_CACHE_KEY,
      )

    if (cachedPermissions) {
      return cachedPermissions
    }

    const permissions = await this.prismaService.permission.findMany({
      select: {
        name: true,
      },
    })

    const permissionNames = AvailablePermissionNamesSchema.parse(
      permissions.map((permission) => permission.name),
    )

    await this.cacheManager.set(
      PermissionService.AVAILABLE_PERMISSIONS_CACHE_KEY,
      permissionNames,
      PermissionService.AVAILABLE_PERMISSIONS_TTL,
    )

    return permissionNames
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
