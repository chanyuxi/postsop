import { z } from 'zod'

import { defineApiEndpoint } from '../../core'
import {
  RefreshTokenRequestSchema,
  SignInRequestSchema,
  SignUpRequestSchema,
} from './request-schemas'
import {
  RefreshTokenResponseSchema,
  SignInResponseSchema,
} from './response-schemas'

export const authEndpoints = {
  refreshToken: defineApiEndpoint({
    method: 'POST',
    path: '/auth/refresh-token',
    bodySchema: RefreshTokenRequestSchema,
    responseSchema: RefreshTokenResponseSchema,
    skipAuthRefresh: true,
  }),
  signIn: defineApiEndpoint({
    method: 'POST',
    path: '/auth/sign-in',
    bodySchema: SignInRequestSchema,
    responseSchema: SignInResponseSchema,
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
    bodySchema: SignUpRequestSchema,
    responseSchema: z.void(),
    skipAuthRefresh: true,
  }),
} as const
