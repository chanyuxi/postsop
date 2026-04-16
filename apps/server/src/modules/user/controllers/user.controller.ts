import { userProfileEndpoint } from '@postsop/contracts/user'

import {
  AuthContext,
  EndpointController,
  EndpointHandler,
} from '@/common/decorators'

import { UserProfileQueryService } from '../queries/user-profile.query.service'

@EndpointController('user')
export class UserController {
  constructor(
    private readonly userProfileQueryService: UserProfileQueryService,
  ) {}

  @EndpointHandler(userProfileEndpoint)
  getProfile(@AuthContext('user.id') userId: number) {
    return this.userProfileQueryService.findUserProfileByUserId(userId)
  }
}
