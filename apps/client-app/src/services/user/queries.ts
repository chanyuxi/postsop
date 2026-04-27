import { useQuery } from '@tanstack/react-query'

import { userKey } from './keys'
import { requestProfile, requestProfileStatus } from './request'

export function useProfileQuery() {
  return useQuery({
    queryFn: requestProfile,
    queryKey: userKey.profile(),
  })
}

export function useProfileStatusQuery() {
  return useQuery({
    queryFn: requestProfileStatus,
    queryKey: userKey.profileStatus(),
  })
}
