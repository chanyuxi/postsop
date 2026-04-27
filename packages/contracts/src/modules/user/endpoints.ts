import { defineApiEndpoint } from '../..'
import { UserProfileStatusViewSchema, UserProfileViewSchema } from './schemas'

/**
 * Returns the current authenticated user's profile.
 */
export const userProfileEndpoint = defineApiEndpoint({
  method: 'GET',
  path: '/user/profile',
  responseSchema: UserProfileViewSchema.nullable(),
})

export const userProfileStatusEndpoint = defineApiEndpoint({
  method: 'GET',
  path: '/user/profile/status',
  responseSchema: UserProfileStatusViewSchema,
})
