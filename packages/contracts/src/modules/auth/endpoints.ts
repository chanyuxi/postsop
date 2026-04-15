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
    dataSchema: RefreshTokenRequestSchema,
    responseSchema: RefreshTokenResponseSchema,
    skipAuthRefresh: true,
  }),
  signIn: defineApiEndpoint({
    method: 'POST',
    path: '/auth/sign-in',
    dataSchema: SignInRequestSchema,
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
    dataSchema: SignUpRequestSchema,
    responseSchema: z.void(),
    skipAuthRefresh: true,
  }),
} as const
