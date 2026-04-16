import { Injectable } from '@nestjs/common'

import type { SessionUser } from '@postsop/contracts/auth'

import { PrismaService } from '@/database/prisma.service'

import { toSessionUser } from '../mappers/session-user.mapper'
import {
  authUserSelect,
  sessionUserSelect,
} from '../selectors/session-user.select'

@Injectable()
export class UserAuthQueryService {
  constructor(private readonly prismaService: PrismaService) {}

  async findUserForSignInByEmail(email: string) {
    const user = await this.prismaService.user.findUnique({
      where: { email },
      select: authUserSelect,
    })

    if (!user) {
      return null
    }

    return {
      ...user,
      sessionUser: toSessionUser(user),
    }
  }

  async findSessionUserById(id: number): Promise<SessionUser | null> {
    const user = await this.prismaService.user.findUnique({
      where: { id },
      select: sessionUserSelect,
    })

    return user ? toSessionUser(user) : null
  }
}
