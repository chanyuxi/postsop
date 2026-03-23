import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Request } from 'express'

import { PermissionService } from '@/modules/permission/services/permission.service'

import { PERMISSIONS_KEY } from '../decorators/permissions.decorator'

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly permissionService: PermissionService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    )

    if (!requiredPermissions?.length) {
      return true
    }

    const request = context.switchToHttp().getRequest<Request>()
    const userId = request.jwtPayload?.user.id

    if (!userId) {
      throw new ForbiddenException('Missing authenticated user context')
    }

    const grantedPermissions =
      await this.permissionService.getUserPermissionNames(userId)
    const grantedPermissionSet = new Set(grantedPermissions)
    const hasAllPermissions = requiredPermissions.every((permission) =>
      grantedPermissionSet.has(permission),
    )

    if (!hasAllPermissions) {
      throw new ForbiddenException('Insufficient permissions')
    }

    return true
  }
}
