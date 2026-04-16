import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Request } from 'express'

import type { PermissionName } from '@postsop/contracts/permissions'

import { AppException } from '@/common/exceptions/app.exception'
import { PermissionService } from '@/modules/permission/services/permission.service'

import { PERMISSIONS_KEY } from '../decorators/permissions.decorator'

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly permissionService: PermissionService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<
      PermissionName[]
    >(PERMISSIONS_KEY, [context.getHandler(), context.getClass()])

    if (!requiredPermissions?.length) {
      return true
    }

    const request = context.switchToHttp().getRequest<Request>()
    const userId = request.authContext?.sub

    if (!userId) {
      throw AppException.unauthorized('Missing authenticated user context')
    }

    const grantedPermissions =
      await this.permissionService.getUserPermissionNames(userId)
    const grantedPermissionSet = new Set(grantedPermissions)
    const hasAllPermissions = requiredPermissions.every((permission) =>
      grantedPermissionSet.has(permission),
    )

    if (!hasAllPermissions) {
      throw AppException.permissionDenied('Insufficient permissions')
    }

    return true
  }
}
