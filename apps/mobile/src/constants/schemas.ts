import { z } from 'zod'

export const loginSchema = z.object({
  email: z.email('Invalid email address'),
  password: z
    .string('Password is required')
    .min(6, { error: 'Password must be at least 8 characters long' }),
})
