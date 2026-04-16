import type { Prisma } from '@/generated/prisma/client'

export const sessionUserSelect = {
  id: true,
  email: true,
  roles: {
    select: {
      name: true,
    },
  },
} satisfies Prisma.UserSelect

export const authUserSelect = {
  ...sessionUserSelect,
  password: true,
  status: true,
} satisfies Prisma.UserSelect

export type SessionUserRecord = Prisma.UserGetPayload<{
  select: typeof sessionUserSelect
}>

export type AuthUserRecord = Prisma.UserGetPayload<{
  select: typeof authUserSelect
}>
