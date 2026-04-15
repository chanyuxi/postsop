import { availablePermissionsEndpoint } from '@postsop/contracts/permission'

import {
  EndpointController,
  EndpointHandler,
  Public,
} from '@/common/decorators'

import { PermissionService } from '../services/permission.service'

@EndpointController('permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Public()
  @EndpointHandler(availablePermissionsEndpoint)
  async getAvailablePermissionNames() {
    return this.permissionService.findAllPermissionNames()
  }
}
