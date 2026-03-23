import { Injectable } from '@nestjs/common'

import { hashPassword } from '@/common/utils/password.util'
import { PrismaService } from '@/database/prisma.service'
import { SignUpDto } from '@/modules/auth/dto/sign-up.dto'

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async createUser(signUpDto: SignUpDto) {
    const passwordHash = await hashPassword(signUpDto.password)

    try {
      return await this.prismaService.user.create({
        data: {
          email: signUpDto.email,
          password: passwordHash,
        },
      })
    } catch (error) {
      if (
        this.prismaService.errors.isCreateError(error) &&
        this.prismaService.errors.isUniqueConstraintError(error)
      ) {
        return null
      }

      throw error
    }
  }

  findAuthUserByEmail(email: string) {
    return this.prismaService.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        email: true,
        password: true,
        roles: {
          select: {
            name: true,
          },
        },
      },
    })
  }

  findUserById(userId: number) {
    return this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
      },
    })
  }

  updatePasswordHash(userId: number, passwordHash: string) {
    return this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: {
        password: passwordHash,
      },
    })
  }
}
