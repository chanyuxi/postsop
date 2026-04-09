import { z } from 'zod'

const DateOnlyString = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date')

export const UserProfileGender = z.enum([
  'MALE',
  'FEMALE',
  'OTHER',
  'UNSPECIFIED',
])

export type UserProfileGender = z.infer<typeof UserProfileGender>

export const UserProfileView = z
  .object({
    nickname: z.string().nullable(),
    avatarUrl: z.string().nullable(),
    birthday: DateOnlyString.nullable(),
    gender: UserProfileGender,
    bio: z.string().nullable(),
    country: z.string().nullable(),
    city: z.string().nullable(),
    address: z.string().nullable(),
  })
  .strict()

export type UserProfileView = z.infer<typeof UserProfileView>
