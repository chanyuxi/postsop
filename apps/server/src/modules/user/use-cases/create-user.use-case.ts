import { Injectable } from '@nestjs/common'

import type { SignUpRequest } from '@postsop/contracts/auth'

import { hashPassword } from '@/common/utils/password.util'
import { PrismaService } from '@/database/prisma.service'

@Injectable()
export class CreateUserUseCase {
  constructor(private readonly prismaService: PrismaService) {}

  async execute(signUpRequest: SignUpRequest) {
    const { email, password } = signUpRequest

    const passwordHash = await hashPassword(password)

    return this.prismaService.returnNullOnUniqueConstraint(() =>
      this.prismaService.user.create({
        data: {
          email,
          password: passwordHash,
          profile: {
            create: {},
          },
        },
      }),
    )
  }
}
