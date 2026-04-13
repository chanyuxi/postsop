import type { PipeTransform } from '@nestjs/common'
import type { ZodType } from 'zod'

import { AppException } from '@/common/exceptions/app.exception'

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodType) {}

  transform(value: unknown) {
    const parsedValue = this.schema.safeParse(value)

    if (!parsedValue.success) {
      const firstIssue = parsedValue.error.issues[0]

      throw AppException.invalidParams(firstIssue?.message, parsedValue.error)
    }

    return parsedValue.data
  }
}
