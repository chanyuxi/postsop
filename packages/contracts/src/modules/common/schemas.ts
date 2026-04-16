import { z } from 'zod'

export const JwtPayloadSchema = z.strictObject({
  user: z.strictObject({
    id: z.number(),
  }),
  sessionId: z.string(),
})
