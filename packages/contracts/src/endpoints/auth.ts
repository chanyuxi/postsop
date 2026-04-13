import { z } from 'zod'

import {
  RefreshTokenResultSchema,
  RefreshTokenSchema,
  SignInResultSchema,
  SignInSchema,
  SignUpSchema,
} from '../schemas'
import { defineApiEndpoint } from './shared'

export const authEndpoints = {
  refreshToken: defineApiEndpoint({
    method: 'POST',
    path: '/auth/refresh-token',
    requestSchema: RefreshTokenSchema,
    responseSchema: RefreshTokenResultSchema,
    skipAuthRefresh: true,
  }),
  signIn: defineApiEndpoint({
    method: 'POST',
    path: '/auth/sign-in',
    requestSchema: SignInSchema,
    responseSchema: SignInResultSchema,
    skipAuthRefresh: true,
  }),
  signOut: defineApiEndpoint({
    method: 'POST',
    path: '/auth/sign-out',
    responseSchema: z.void(),
  }),
  signUp: defineApiEndpoint({
    method: 'POST',
    path: '/auth/sign-up',
    requestSchema: SignUpSchema,
    responseSchema: z.void(),
    skipAuthRefresh: true,
  }),
} as const
