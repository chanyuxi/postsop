import { Injectable } from '@nestjs/common'

import type {
  SignUpSchema,
  UserProfileViewSchema,
} from '@postsop/contracts/schemas'

import { hashPassword } from '@/common/utils/password.util'
import { PrismaService } from '@/database/prisma.service'

function serializeDateOnly(date: Date): string {
  const year = date.getUTCFullYear()
  const month = String(date.getUTCMonth() + 1).padStart(2, '0')
  const day = String(date.getUTCDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  generateNickname(email: string) {
    return email
  }

  async createUser(signUpSchema: SignUpSchema) {
    const { email, password } = signUpSchema

    const passwordHash = await hashPassword(password)
    const nickname = this.generateNickname(email)

    try {
      return await this.prismaService.user.create({
        data: {
          email: email,
          password: passwordHash,
          profile: {
            create: {
              nickname,
            },
          },
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

  async findUserProfileByUserId(
    userId: number,
  ): Promise<UserProfileViewSchema | null> {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        profile: {
          select: {
            nickname: true,
            avatarUrl: true,
            birthday: true,
            gender: true,
            bio: true,
            country: true,
            city: true,
            address: true,
          },
        },
      },
    })

    if (!user?.profile) {
      return null
    }

    return {
      nickname: user.profile.nickname,
      avatarUrl: user.profile.avatarUrl,
      birthday: user.profile.birthday
        ? serializeDateOnly(user.profile.birthday)
        : null,
      gender: user.profile.gender,
      bio: user.profile.bio,
      country: user.profile.country,
      city: user.profile.city,
      address: user.profile.address,
    }
  }
}
