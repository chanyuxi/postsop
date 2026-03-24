import { type Cache, CACHE_MANAGER } from '@nestjs/cache-manager'
import { Inject, Injectable } from '@nestjs/common'

import { PrismaService } from '@/database/prisma.service'

@Injectable()
export class PermissionService {
  private static readonly AVAILABLE_PERMISSIONS_CACHE_KEY = 'perm:all'
  private static readonly AVAILABLE_PERMISSIONS_TTL = 60 * 60 * 1000
  private static readonly USER_PERMISSIONS_TTL = 5 * 60 * 1000

  constructor(
    private readonly prismaService: PrismaService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async findAllPermissionNames(): Promise<string[]> {
    const cachedPermissions = await this.cacheManager.get<string[]>(
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

    const permissionNames = permissions.map((permission) => permission.name)

    await this.cacheManager.set(
      PermissionService.AVAILABLE_PERMISSIONS_CACHE_KEY,
      permissionNames,
      PermissionService.AVAILABLE_PERMISSIONS_TTL,
    )

    return permissionNames
  }

  async getUserPermissionNames(userId: number): Promise<string[]> {
    const cacheKey = this.getUserPermissionsCacheKey(userId)
    const cachedPermissions = await this.cacheManager.get<string[]>(cacheKey)

    if (cachedPermissions) {
      return cachedPermissions
    }

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

    const permissionNames = [
      ...new Set(
        (user?.roles ?? []).flatMap((role) =>
          role.permissions.map((permission) => permission.name),
        ),
      ),
    ]

    await this.cacheManager.set(
      cacheKey,
      permissionNames,
      PermissionService.USER_PERMISSIONS_TTL,
    )

    return permissionNames
  }

  private getUserPermissionsCacheKey(userId: number): string {
    return `perm:u:${userId}`
  }
}
