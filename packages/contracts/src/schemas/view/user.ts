import { z } from 'zod'

import { dateOnlyString, gender } from '../shared'

export const UserProfileViewSchema = z
  .object({
    nickname: z.string().nullable(),
    avatarUrl: z.string().nullable(),
    birthday: dateOnlyString.nullable(),
    gender,
    bio: z.string().nullable(),
    country: z.string().nullable(),
    city: z.string().nullable(),
    address: z.string().nullable(),
  })
  .strict()

export type UserProfileViewSchema = z.infer<typeof UserProfileViewSchema>
