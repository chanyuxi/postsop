import { Injectable } from '@nestjs/common'

import { PrismaService } from '@/database/prisma.service'
import type { UserStatus } from '@/generated/prisma/enums'

import {
  sessionValidationUserSelect,
  signInUserSelect,
} from '../selectors/auth-user.select'

@Injectable()
export class UserAuthQueryService {
  constructor(private readonly prismaService: PrismaService) {}

  async findUserForSignInByEmail(email: string) {
    return this.prismaService.user.findUnique({
      where: { email },
      select: signInUserSelect,
    })
  }

  async findUserStatusForSessionById(id: number): Promise<UserStatus | null> {
    const user = await this.prismaService.user.findUnique({
      where: { id },
      select: sessionValidationUserSelect,
    })

    return user?.status ?? null
  }
}
