import type { ArgumentsHost } from '@nestjs/common'
import { BadRequestException, HttpStatus, Logger } from '@nestjs/common'

import {
  INTERNAL_MESSAGE_MAP,
  InternalStatusCodes,
} from '@postsop/contracts/http'

import { AppException } from '@/common/exceptions/app.exception'

import { ApiExceptionFilter } from './api-exception.filter'

describe('ApiExceptionFilter', () => {
  beforeEach(() => {
    jest.spyOn(Logger.prototype, 'error').mockImplementation()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  const createHost = () => {
    const json = jest.fn()
    const status = jest.fn().mockReturnValue({ json })

    const host = {
      switchToHttp: () => ({
        getRequest: () => ({
          method: 'GET',
          url: '/health',
        }),
        getResponse: () => ({
          status,
        }),
      }),
    } as unknown as ArgumentsHost

    return {
      host,
      json,
      status,
    }
  }

  it('serializes app exceptions with their internal code', () => {
    const filter = new ApiExceptionFilter()
    const { host, json, status } = createHost()

    filter.catch(AppException.tokenExpired('Token expired'), host)

    expect(status).toHaveBeenCalledWith(HttpStatus.FORBIDDEN)
    expect(json).toHaveBeenCalledWith({
      code: InternalStatusCodes.TOKEN_EXPIRED,
      data: null,
      message: 'Token expired',
    })
  })

  it('maps generic http exceptions to contract codes', () => {
    const filter = new ApiExceptionFilter()
    const { host, json, status } = createHost()

    filter.catch(new BadRequestException('Validation failed'), host)

    expect(status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST)
    expect(json).toHaveBeenCalledWith({
      code: InternalStatusCodes.INVALID_PARAMS,
      data: null,
      message: 'Validation failed',
    })
  })

  it('masks unknown errors as internal failures', () => {
    const filter = new ApiExceptionFilter()
    const { host, json, status } = createHost()

    filter.catch(new Error('database offline'), host)

    expect(status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR)
    expect(json).toHaveBeenCalledWith({
      code: InternalStatusCodes.INTERNAL_ERROR,
      data: null,
      message: INTERNAL_MESSAGE_MAP[InternalStatusCodes.INTERNAL_ERROR],
    })
  })
})
