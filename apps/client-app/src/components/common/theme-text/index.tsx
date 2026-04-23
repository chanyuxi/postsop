import type { PropsWithChildren } from 'react'
import type { TextProps } from 'react-native'
import { Text } from 'react-native'

import { withDefaultFontStyle } from '@/utils/font'
import { tw } from '@/utils/style'

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
      className={tw('text-foreground text-base', className)}
      style={withDefaultFontStyle({ className, style })}
    >
      {children}
    </Text>
  )
}
