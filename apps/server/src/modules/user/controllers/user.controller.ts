import { Controller, Get } from '@nestjs/common'

import { AuthContext } from '@/common/decorators/auth-context.decorator'

import { UserService } from '../services/user.service'

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('profile')
  getProfile(@AuthContext('user.id') userId: number) {
    return this.userService.findUserProfileByUserId(userId)
  }
}
