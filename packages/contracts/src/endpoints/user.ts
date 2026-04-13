import { UserProfileViewSchema } from '../schemas'
import { defineApiEndpoint } from './shared'

export const userEndpoints = {
  profile: defineApiEndpoint({
    method: 'GET',
    path: '/user/profile',
    responseSchema: UserProfileViewSchema.nullable(),
  }),
} as const
