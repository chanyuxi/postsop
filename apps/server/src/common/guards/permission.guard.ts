import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Request } from 'express'

import { hasAllPermissions } from '@postsop/access-control/bitmap'
import type { PermissionName } from '@postsop/access-control/permissions'

import { AppException } from '@/common/exceptions/app.exception'

import { PERMISSIONS_KEY } from '../decorators/permissions.decorator'

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<
      PermissionName[]
    >(PERMISSIONS_KEY, [context.getHandler(), context.getClass()])

    if (!requiredPermissions?.length) {
      return true
    }

    const request = context.switchToHttp().getRequest<Request>()
    const authContext = request.authContext

    if (!authContext) {
      throw AppException.unauthorized('Missing authenticated user context')
    }

    if (!hasAllPermissions(authContext.pm, requiredPermissions)) {
      throw AppException.permissionDenied('Insufficient permissions')
    }

    return true
  }
}
