import type { Prisma } from '@/generated/prisma/client'

export const signInUserSelect = {
  id: true,
  password: true,
  status: true,
} satisfies Prisma.UserSelect

export const sessionValidationUserSelect = {
  status: true,
} satisfies Prisma.UserSelect

export type SignInUserRecord = Prisma.UserGetPayload<{
  select: typeof signInUserSelect
}>

export type SessionValidationUserRecord = Prisma.UserGetPayload<{
  select: typeof sessionValidationUserSelect
}>
