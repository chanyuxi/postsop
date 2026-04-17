import { SetMetadata } from '@nestjs/common'

export const PERMISSIONS_IMPERATIVE_KEY = 'permissions_imperative'

/**
 * Use this annotation to mark high-sensitivity apis, requiring
 * real-time verification of permissions
 */
export const PermissionsImperative = SetMetadata(
  PERMISSIONS_IMPERATIVE_KEY,
  true,
)
