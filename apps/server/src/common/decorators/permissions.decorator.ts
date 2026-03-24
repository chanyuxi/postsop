import { SetMetadata } from '@nestjs/common'

export const PERMISSIONS_KEY = 'permissions'

/**
 * Decorator to mark a controller or method as requiring specific permissions
 * @param permissions - The permissions required to access the controller or method
 * @returns The decorator function
 */
export const Permissions = (permissions: string | string[]) => {
  if (typeof permissions === 'string') {
    permissions = [permissions]
  }

  return SetMetadata(PERMISSIONS_KEY, permissions)
}
