import { z } from 'zod'

export const email = z.email()
export const password = z
  .string()
  .min(6, { error: 'Password cannot be less than 6 characters' })

export const dateOnlyString = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date')

export const gender = z.enum(['MALE', 'FEMALE', 'OTHER', 'UNSPECIFIED'])
