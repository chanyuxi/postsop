import { z } from 'zod'

export const SignUpDto = z
  .object({
    email: z.string().trim().toLowerCase().email(),
    password: z.string().min(6),
  })
  .strict()

export type SignUpDto = z.infer<typeof SignUpDto>
