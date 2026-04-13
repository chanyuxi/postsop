import { userEndpoints } from '@postsop/contracts/endpoints'
import type { UserProfileViewSchema } from '@postsop/contracts/schemas'

import { requestEndpoint } from '@/api/helpers'

export async function requestProfile(): Promise<UserProfileViewSchema | null> {
  return requestEndpoint(userEndpoints.profile)
}
