import { forwardRef } from 'react'
import type { TextInputProps } from 'react-native'
import { TextInput } from 'react-native'
import { useCSSVariable } from 'uniwind'

import { withDefaultFontStyle } from '@/utils/font'

export const ThemeTextInput = forwardRef<TextInput, TextInputProps>(
  function ThemeTextInput({ className, style, ...props }, ref) {
    // TODO: Please confirm if this will damage performance, because the rendering is very frequent
    const foregroundSecondary = useCSSVariable(
      '--color-foreground-secondary'
    ) as string

    return (
      <TextInput
        placeholderTextColor={foregroundSecondary}
        {...props}
        className={className}
        ref={ref}
        style={withDefaultFontStyle({ className, style })}
      />
    )
  }
)
