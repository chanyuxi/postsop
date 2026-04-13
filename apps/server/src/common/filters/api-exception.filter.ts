import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common'
import {
  Catch,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common'
import type { Request, Response } from 'express'

import {
  INTERNAL_MESSAGE_MAP,
  InternalStatusCodes,
} from '@postsop/contracts/http'

import { AppException } from '../exceptions/app.exception'
import { ResponseBuilder } from '../utils/response-builder.util'

interface ResolvedException {
  httpStatus: number
  internalCode: InternalStatusCodes
  message: string
}

@Catch()
@Injectable()
export class ApiExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(ApiExceptionFilter.name)

  catch(exception: unknown, host: ArgumentsHost) {
    const http = host.switchToHttp()
    const request = http.getRequest<Request>()
    const response = http.getResponse<Response>()
    const resolvedException = this.resolveException(exception)

    if (resolvedException.httpStatus >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(
        `${request.method} ${request.url} failed with ${resolvedException.httpStatus}`,
        exception instanceof Error ? exception.stack : undefined,
      )
    }

    response
      .status(resolvedException.httpStatus)
      .json(
        ResponseBuilder.failure(
          resolvedException.internalCode,
          resolvedException.message,
        ),
      )
  }

  private resolveException(exception: unknown): ResolvedException {
    if (exception instanceof AppException) {
      return {
        httpStatus: exception.getStatus(),
        internalCode: exception.internalCode,
        message: exception.message,
      }
    }

    if (exception instanceof HttpException) {
      const httpStatus = exception.getStatus()
      const internalCode = this.mapHttpStatusToInternalCode(httpStatus)

      return {
        httpStatus,
        internalCode,
        message:
          httpStatus >= HttpStatus.INTERNAL_SERVER_ERROR
            ? INTERNAL_MESSAGE_MAP[internalCode]
            : (this.extractMessage(exception.getResponse()) ??
              INTERNAL_MESSAGE_MAP[internalCode]),
      }
    }

    return {
      httpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
      internalCode: InternalStatusCodes.INTERNAL_ERROR,
      message: INTERNAL_MESSAGE_MAP[InternalStatusCodes.INTERNAL_ERROR],
    }
  }

  private mapHttpStatusToInternalCode(status: number): InternalStatusCodes {
    switch (status) {
      case HttpStatus.BAD_REQUEST:
      case HttpStatus.UNPROCESSABLE_ENTITY:
        return InternalStatusCodes.INVALID_PARAMS
      case HttpStatus.UNAUTHORIZED:
        return InternalStatusCodes.UNAUTHORIZED
      case HttpStatus.FORBIDDEN:
        return InternalStatusCodes.PERMISSION_DENIED
      case HttpStatus.NOT_FOUND:
        return InternalStatusCodes.RESOURCE_NOT_FOUND
      case HttpStatus.CONFLICT:
        return InternalStatusCodes.RESOURCE_ALREADY_EXISTS
      case HttpStatus.TOO_MANY_REQUESTS:
        return InternalStatusCodes.TOO_MANY_REQUESTS
      case HttpStatus.SERVICE_UNAVAILABLE:
        return InternalStatusCodes.SERVICE_UNAVAILABLE
      default:
        return InternalStatusCodes.INTERNAL_ERROR
    }
  }

  private extractMessage(response: string | object): string | null {
    if (typeof response === 'string') {
      return response
    }

    if (!response) {
      return null
    }

    const message = Reflect.get(response, 'message')

    if (Array.isArray(message)) {
      return message.join('; ')
    }

    return typeof message === 'string' ? message : null
  }
}
