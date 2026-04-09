import { useQuery } from '@tanstack/react-query'

import { userKey } from '../../queryKeys'
import { requestProfile } from '../request'

export default function useProfileQuery() {
  return useQuery({
    queryFn: requestProfile,
    queryKey: userKey.profile(),
  })
}
