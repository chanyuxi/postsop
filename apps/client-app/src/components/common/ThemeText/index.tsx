import type { PropsWithChildren } from 'react'
import type { TextProps } from 'react-native'
import { Text } from 'react-native'
import { twMerge } from 'tailwind-merge'

import { withDefaultFontStyle } from '@/utils/font'

interface ThemeTextProps extends TextProps {
  className?: string
}

export function ThemeText({
  className,
  children,
  style,
  ...props
}: PropsWithChildren<ThemeTextProps>) {
  return (
    <Text
      {...props}
      className={twMerge('text-foreground text-base', className)}
      style={withDefaultFontStyle({ className, style })}
    >
      {children}
    </Text>
  )
}
