import { userProfileEndpoint } from '@postsop/contracts/user'

import {
  AuthContext,
  EndpointController,
  EndpointHandler,
} from '@/common/decorators'

import { UserService } from '../services/user.service'

@EndpointController('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @EndpointHandler(userProfileEndpoint)
  getProfile(@AuthContext('user.id') userId: number) {
    return this.userService.findUserProfileByUserId(userId)
  }
}
