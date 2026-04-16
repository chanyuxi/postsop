import type { SessionUser } from '@postsop/contracts/auth'

import type { SessionUserRecord } from '../selectors/session-user.select'

export type SessionUserSource = Pick<
  SessionUserRecord,
  'email' | 'id' | 'roles'
>

export function toSessionUser(user: SessionUserSource): SessionUser {
  return {
    email: user.email,
    id: user.id,
    roles: user.roles,
  }
}
