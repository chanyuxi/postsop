import { UserProfileViewSchema } from '@postsop/contracts/schemas'

import { get } from '@/api'

const UserProfileResponse = UserProfileViewSchema.nullable()

export async function requestProfile(): Promise<UserProfileViewSchema | null> {
  return UserProfileResponse.parse(await get<unknown>('/user/profile'))
}
