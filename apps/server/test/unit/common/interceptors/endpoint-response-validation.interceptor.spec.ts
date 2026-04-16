import type { CallHandler, ExecutionContext } from '@nestjs/common'
import { lastValueFrom, of } from 'rxjs'
import { z } from 'zod'

import { defineApiEndpoint } from '@postsop/contracts'
import { InternalStatusCodes } from '@postsop/contracts/http'

import { AppException } from '@/common/exceptions/app.exception'
import { EndpointResponseValidationInterceptor } from '@/common/interceptors/endpoint-response-validation.interceptor'

describe('EndpointResponseValidationInterceptor', () => {
  it('passes through responses that match the endpoint contract', async () => {
    const endpoint = defineApiEndpoint({
      method: 'GET',
      path: '/test/profile',
      responseSchema: z.strictObject({
        name: z.string(),
      }),
    })
    const interceptor = new EndpointResponseValidationInterceptor(endpoint)
    const next: CallHandler = {
      handle: () => of({ name: 'Coco' }),
    }

    await expect(
      lastValueFrom(interceptor.intercept({} as ExecutionContext, next)),
    ).resolves.toEqual({ name: 'Coco' })
  })

  it('fails fast when a response drifts from the endpoint contract', async () => {
    const endpoint = defineApiEndpoint({
      method: 'GET',
      path: '/test/profile',
      responseSchema: z.strictObject({
        name: z.string(),
      }),
    })
    const interceptor = new EndpointResponseValidationInterceptor(endpoint)
    const next: CallHandler = {
      handle: () => of({ name: 123 }),
    }

    const response = lastValueFrom(
      interceptor.intercept({} as ExecutionContext, next),
    )

    await expect(response).rejects.toBeInstanceOf(AppException)
    await expect(response).rejects.toMatchObject({
      internalCode: InternalStatusCodes.INTERNAL_ERROR,
    })
  })
})
