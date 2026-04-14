import { defineApiEndpoint } from '../../core'
import { UserProfileViewSchema } from './response-schemas'

export const userEndpoints = {
  profile: defineApiEndpoint({
    method: 'GET',
    path: '/user/profile',
    responseSchema: UserProfileViewSchema.nullable(),
  }),
} as const
