import { Injectable } from '@nestjs/common'

import type { SignUpRequest } from '@postsop/contracts/auth'
import type { UserProfileView } from '@postsop/contracts/user'

import { hashPassword } from '@/common/utils/password.util'
import { PrismaService } from '@/database/prisma.service'
import {
  authUserSelect,
  sessionUserSelect,
} from '@/modules/user/serializers/session-user.serializer'
import {
  toUserProfileView,
  userWithProfileSelect,
} from '@/modules/user/serializers/user-profile.serializer'

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async createUser(signUpRequest: SignUpRequest) {
    const { email, password } = signUpRequest

    const passwordHash = await hashPassword(password)
    const nickname = this.automaticallyGenerateNickname(email)

    return this.prismaService.returnNullOnUniqueConstraint(() =>
      this.prismaService.user.create({
        data: {
          email,
          password: passwordHash,
          profile: {
            create: {
              nickname,
            },
          },
        },
      }),
    )
  }

  findUserForSignInByEmail(email: string) {
    return this.prismaService.user.findUnique({
      where: { email },
      select: authUserSelect,
    })
  }

  findSessionUserById(id: number) {
    return this.prismaService.user.findUnique({
      where: { id },
      select: sessionUserSelect,
    })
  }

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

  private automaticallyGenerateNickname(email: string) {
    return email
  }
}
