import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common'
import {
  Catch,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common'
import type { Request, Response } from 'express'

import { Codes, getCodeReasonPhrase } from '@postsop/contracts/http'

import { AppException } from '../exceptions/app.exception'
import { ResponseBuilder } from '../utils/response-builder.util'

interface ResolvedException {
  httpStatus: number
  code: Codes
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
    const resolvedException = this.normalizeResolvedException(
      this.resolveException(exception),
    )

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
          resolvedException.code,
          resolvedException.message,
        ),
      )
  }

  private resolveException(exception: unknown): ResolvedException {
    if (exception instanceof AppException) {
      return {
        httpStatus: exception.getStatus(),
        code: exception.code,
        message: exception.message,
      }
    }

    if (exception instanceof HttpException) {
      const httpStatus = exception.getStatus()
      const code = this.mapHttpStatusToCode(httpStatus)

      return {
        httpStatus,
        code,
        message:
          httpStatus >= HttpStatus.INTERNAL_SERVER_ERROR
            ? getCodeReasonPhrase(code)
            : (this.extractMessage(exception.getResponse()) ??
              getCodeReasonPhrase(code)),
      }
    }

    return {
      httpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
      code: Codes.INTERNAL_ERROR,
      message: getCodeReasonPhrase(Codes.INTERNAL_ERROR),
    }
  }

  private normalizeResolvedException(
    resolvedException: ResolvedException,
  ): ResolvedException {
    if (!this.isSuccessfulHttpStatus(resolvedException.httpStatus)) {
      return resolvedException
    }

    return {
      httpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
      code: Codes.INTERNAL_ERROR,
      message: getCodeReasonPhrase(Codes.INTERNAL_ERROR),
    }
  }

  private mapHttpStatusToCode(status: number): Codes {
    switch (status) {
      case HttpStatus.BAD_REQUEST:
      case HttpStatus.UNPROCESSABLE_ENTITY:
        return Codes.INVALID_PARAMS
      case HttpStatus.UNAUTHORIZED:
        return Codes.UNAUTHORIZED
      case HttpStatus.FORBIDDEN:
        return Codes.PERMISSION_DENIED
      case HttpStatus.NOT_FOUND:
        return Codes.RESOURCE_NOT_FOUND
      case HttpStatus.CONFLICT:
        return Codes.RESOURCE_ALREADY_EXISTS
      case HttpStatus.TOO_MANY_REQUESTS:
        return Codes.TOO_MANY_REQUESTS
      case HttpStatus.SERVICE_UNAVAILABLE:
        return Codes.SERVICE_UNAVAILABLE
      default:
        return Codes.INTERNAL_ERROR
    }
  }

  private isSuccessfulHttpStatus(status: number) {
    return status >= HttpStatus.OK && status < 300
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
