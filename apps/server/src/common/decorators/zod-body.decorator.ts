import { Body } from '@nestjs/common'
import type { ZodType } from 'zod'

import { getCachedZodValidationPipe } from './zod-parameter.decorator'

export const ZodBody = (schema: ZodType): ParameterDecorator =>
  Body(getCachedZodValidationPipe(schema))
