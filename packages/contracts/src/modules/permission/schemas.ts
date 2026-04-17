import { z } from 'zod'

import { PermissionNameSchema } from '@postsop/access-control/permissions'

export const AvailablePermissionNamesSchema = z.array(PermissionNameSchema)
export type AvailablePermissionNames = z.infer<
  typeof AvailablePermissionNamesSchema
>
