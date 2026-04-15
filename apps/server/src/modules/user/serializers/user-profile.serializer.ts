import type { UserProfileView } from '@postsop/contracts/user'

import type { Prisma } from '@/generated/prisma/client'

export const userProfileSelect = {
  nickname: true,
  avatarUrl: true,
  birthday: true,
  gender: true,
  bio: true,
  country: true,
  city: true,
  address: true,
} satisfies Prisma.UserProfileSelect

export const userWithProfileSelect = {
  profile: {
    select: userProfileSelect,
  },
} satisfies Prisma.UserSelect

type UserProfileRecord = Prisma.UserProfileGetPayload<{
  select: typeof userProfileSelect
}>

function serializeDateOnly(date: Date): string {
  const year = date.getUTCFullYear()
  const month = String(date.getUTCMonth() + 1).padStart(2, '0')
  const day = String(date.getUTCDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

export function toUserProfileView(profile: UserProfileRecord): UserProfileView {
  const { birthday, ...rest } = profile

  return {
    ...rest,
    birthday: birthday ? serializeDateOnly(birthday) : null,
  }
}
