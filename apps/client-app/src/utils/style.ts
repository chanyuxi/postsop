import type { ClassNameValue } from 'tailwind-merge'
import { twMerge } from 'tailwind-merge'

/**
 * Alias for twMerge
 */
export function tw(...classLists: ClassNameValue[]) {
  return twMerge(classLists)
}
