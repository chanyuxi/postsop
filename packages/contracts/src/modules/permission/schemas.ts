import { z } from 'zod'

import { PermissionNameSchema } from '../../core/permissions'

export const AvailablePermissionNamesSchema = z.array(PermissionNameSchema)
export type AvailablePermissionNames = z.infer<
  typeof AvailablePermissionNamesSchema
>
