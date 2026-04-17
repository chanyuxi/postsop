import { Controller } from '@nestjs/common'

import { userProfileEndpoint } from '@postsop/contracts/user'

import { AuthContext } from '@/common/decorators/auth-context.decorator'
import { EndpointHandler } from '@/common/decorators/endpoint-handler.decorator'

import { UserProfileQueryService } from '../queries/user-profile.query.service'

@Controller()
export class UserController {
  constructor(
    private readonly userProfileQueryService: UserProfileQueryService,
  ) {}

  @EndpointHandler(userProfileEndpoint)
  getProfile(@AuthContext('sub') userId: number) {
    return this.userProfileQueryService.findUserProfileByUserId(userId)
  }
}
