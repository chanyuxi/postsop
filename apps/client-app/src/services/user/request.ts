import { userProfileEndpoint } from '@postsop/contracts/user'

import { requestEndpoint } from '@/api'

export async function requestProfile() {
  return requestEndpoint(userProfileEndpoint)
}
