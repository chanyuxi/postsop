import { Injectable } from '@nestjs/common'
import { nanoid } from 'nanoid'

import type { SignUpRequest } from '@postsop/contracts/auth'

import { hashPassword } from '@/common/utils/password.util'
import { PrismaService } from '@/database/prisma.service'

@Injectable()
export class CreateUserUseCase {
  constructor(private readonly prismaService: PrismaService) {}

  async execute(signUpRequest: SignUpRequest) {
    const { email, password: rawPassword } = signUpRequest

    const password = await hashPassword(rawPassword)
    const username = this.generateRandomUsername()

    return this.prismaService.returnNullOnUniqueConstraint(() =>
      this.prismaService.user.create({
        data: {
          email,
          username,
          password,
          profile: {
            create: {
              nickname: this.generateDafaultNickname(),
            },
          },
        },
      }),
    )
  }

  private generateRandomUsername(): string {
    return `ps_${nanoid(8)}`
  }

  private generateDafaultNickname(): string {
    return 'Postsoper'
  }
}
