import { z } from 'zod'

import { dateOnlyString, gender } from '../..'

export const UserProfileViewSchema = z.strictObject({
  nickname: z.string().nullable(),
  avatarUrl: z.string().nullable(),
  birthday: dateOnlyString.nullable(),
  gender,
  bio: z.string().nullable(),
  country: z.string().nullable(),
  city: z.string().nullable(),
  address: z.string().nullable(),
})

export type UserProfileView = z.infer<typeof UserProfileViewSchema>
