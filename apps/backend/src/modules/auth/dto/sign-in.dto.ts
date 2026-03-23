import { z } from 'zod'

export const SignInDto = z
  .object({
    email: z.string().trim().toLowerCase().email(),
    password: z.string().min(6),
  })
  .strict()

export type SignInDto = z.infer<typeof SignInDto>
