import { z } from 'zod'

export const JwtPayloadSchema = z
  .object({
    user: z.object({
      id: z.number(),
    }),
    sessionId: z.string(),
  })
  .strict()

export type JwtPayload = z.infer<typeof JwtPayloadSchema>

declare module 'express' {
  interface Request {
    jwtPayload?: JwtPayload
  }
}
