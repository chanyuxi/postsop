import { Controller, Get } from '@nestjs/common'

import { Public } from '@/common/decorators/public.decorator'

import { PermissionService } from '../services/permission.service'

@Controller('permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Public()
  @Get('available')
  async getAvailablePermissionNames() {
    return this.permissionService.findAllPermissionNames()
  }
}
