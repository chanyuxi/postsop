import { Injectable } from '@nestjs/common'

import type { UserProfileView } from '@postsop/contracts/user'

import { PrismaService } from '@/database/prisma.service'

import { toUserProfileView } from '../mappers/user-profile.mapper'
import { userWithProfileSelect } from '../selectors/user-profile.select'

@Injectable()
export class UserProfileQueryService {
  constructor(private readonly prismaService: PrismaService) {}

  async findUserProfileByUserId(id: number): Promise<UserProfileView | null> {
    const user = await this.prismaService.user.findUnique({
      where: { id },
      select: userWithProfileSelect,
    })

    if (!user?.profile) {
      return null
    }

    return toUserProfileView(user.profile)
  }
}
