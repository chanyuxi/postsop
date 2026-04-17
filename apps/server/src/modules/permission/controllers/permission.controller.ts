import { Controller } from '@nestjs/common'

import { availablePermissionsEndpoint } from '@postsop/contracts/permission'

import { EndpointHandler } from '@/common/decorators/endpoint-handler.decorator'
import { Public } from '@/common/decorators/public.decorator'

import { PermissionService } from '../services/permission.service'

@Controller()
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Public()
  @EndpointHandler(availablePermissionsEndpoint)
  async getAvailablePermissionNames() {
    return this.permissionService.findAllPermissionNames()
  }
}
