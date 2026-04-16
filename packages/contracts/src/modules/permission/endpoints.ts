import { defineApiEndpoint } from '../..'
import { AvailablePermissionNamesSchema } from './schemas'

/**
 * Returns every permission name that can be assigned inside the system.
 */
export const availablePermissionsEndpoint = defineApiEndpoint({
  method: 'GET',
  path: '/permission/available',
  responseSchema: AvailablePermissionNamesSchema,
})
