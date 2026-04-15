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

/**
 * Refreshes an authenticated session using a valid refresh token.
 */
export const refreshTokenEndpoint = defineApiEndpoint({
  method: 'POST',
  path: '/auth/refresh-token',
  dataSchema: RefreshTokenRequestSchema,
  responseSchema: RefreshTokenResponseSchema,
  skipAuthRefresh: true,
})

/**
 * Signs an existing user into the application.
 */
export const signInEndpoint = defineApiEndpoint({
  method: 'POST',
  path: '/auth/sign-in',
  dataSchema: SignInRequestSchema,
  responseSchema: SignInResponseSchema,
  skipAuthRefresh: true,
})

/**
 * Signs the current session out of the application.
 */
export const signOutEndpoint = defineApiEndpoint({
  method: 'POST',
  path: '/auth/sign-out',
  responseSchema: z.void(),
})

/**
 * Creates a new user account.
 */
export const signUpEndpoint = defineApiEndpoint({
  method: 'POST',
  path: '/auth/sign-up',
  dataSchema: SignUpRequestSchema,
  responseSchema: z.void(),
  skipAuthRefresh: true,
})
