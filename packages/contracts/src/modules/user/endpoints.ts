import { defineApiEndpoint } from '../..'
import { UserProfileViewSchema } from './schemas'

/**
 * Returns the current authenticated user's profile.
 */
export const userProfileEndpoint = defineApiEndpoint({
  method: 'GET',
  path: '/user/profile',
  responseSchema: UserProfileViewSchema.nullable(),
})
