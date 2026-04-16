import type { AuthContextPayload } from '@/modules/auth/interfaces/claims.interface'

declare module 'express-serve-static-core' {
  interface Request {
    authContext?: AuthContextPayload
  }
}
