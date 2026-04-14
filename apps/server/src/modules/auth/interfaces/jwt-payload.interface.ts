import { z } from 'zod'

export const JwtPayloadSchema = z.strictObject({
  user: z.strictObject({
    id: z.number(),
  }),
  sessionId: z.string(),
})

export type JwtPayload = z.infer<typeof JwtPayloadSchema>

declare module 'express' {
  interface Request {
    jwtPayload?: JwtPayload
  }
}
