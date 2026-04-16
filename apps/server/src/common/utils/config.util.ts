import { ConfigService } from '@nestjs/config'

export function getPositiveNumberConfig(
  configService: ConfigService,
  key: string,
): number {
  const rawValue = configService.getOrThrow<string>(key)
  const parsedValue = Number(rawValue)

  if (!Number.isInteger(parsedValue) || parsedValue <= 0) {
    throw new Error(`${key} must be a positive integer in milliseconds`)
  }

  return parsedValue
}
