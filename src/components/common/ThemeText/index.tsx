import { type PropsWithChildren } from 'react'
import { Text } from 'react-native'
import { twMerge } from 'tailwind-merge'

interface ThemeTextProps {
  className?: string
}

export function ThemeText({
  className,
  children,
}: PropsWithChildren<ThemeTextProps>) {
  return (
    <Text className={twMerge('text-foreground', className)}>{children}</Text>
  )
}
