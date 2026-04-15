import { Query } from '@nestjs/common'
import type { ZodType } from 'zod'

import { getCachedZodValidationPipe } from './zod-parameter.decorator'

export const ZodQuery = (schema: ZodType): ParameterDecorator =>
  Query(getCachedZodValidationPipe(schema))
