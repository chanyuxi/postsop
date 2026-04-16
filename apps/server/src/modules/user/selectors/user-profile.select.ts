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

export type UserProfileRecord = Prisma.UserProfileGetPayload<{
  select: typeof userProfileSelect
}>
