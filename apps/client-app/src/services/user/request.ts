import { userEndpoints } from '@postsop/contracts/user'

import { requestEndpoint } from '@/api'

export async function requestProfile() {
  return requestEndpoint(userEndpoints.profile)
}
