import { z } from 'zod'

export const AvailablePermissionNamesSchema = z.array(z.string())

export type AvailablePermissionNames = z.infer<
  typeof AvailablePermissionNamesSchema
>
