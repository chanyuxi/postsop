import { Response } from '../interfaces/response.interface'

export class ResponseBuilder {
  static success<T = unknown>(data: T): Response<T> {
    return {
      code: 0,
      message: 'success',
      data,
    }
  }

  static failure<T = unknown>(message: string): Response<T> {
    return {
      code: 1,
      message,
      data: null,
    }
  }
}
