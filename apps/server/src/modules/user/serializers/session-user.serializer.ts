import type { SessionUser } from '@postsop/contracts/auth'

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

export interface SessionUserSource {
  email: string
  id: number
  roles: SessionUser['roles']
}

export function toSessionUser(user: SessionUserSource): SessionUser {
  return {
    email: user.email,
    id: user.id,
    roles: user.roles,
  }
}
