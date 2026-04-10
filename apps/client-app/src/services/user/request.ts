import { UserProfileView } from '@postsop/contracts/types'

import { get } from '@/api'

const UserProfileResponse = UserProfileView.nullable()

export async function requestProfile(): Promise<UserProfileView | null> {
  return UserProfileResponse.parse(await get<unknown>('/user/profile'))
}
