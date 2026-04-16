import type { UserProfileView } from '@postsop/contracts/user'

import type { UserProfileRecord } from '../selectors/user-profile.select'

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
