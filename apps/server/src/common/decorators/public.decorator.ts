import { SetMetadata } from '@nestjs/common'

export const PUBLIC_KEY = 'public'

/**
 * Decorator to mark a controller or method as public
 * @returns The decorator function
 */
export const Public = () => SetMetadata(PUBLIC_KEY, true)
