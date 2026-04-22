import { useQuery } from '@tanstack/react-query'

import { userKey } from './keys'
import { requestProfile } from './request'

export function useProfileQuery() {
  return useQuery({
    queryFn: requestProfile,
    queryKey: userKey.profile(),
  })
}
