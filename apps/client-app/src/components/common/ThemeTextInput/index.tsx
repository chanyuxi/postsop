import { forwardRef } from 'react'
import type { TextInputProps } from 'react-native'
import { TextInput } from 'react-native'

import { withDefaultFontStyle } from '@/utils/font'

export const ThemeTextInput = forwardRef<TextInput, TextInputProps>(
  function ThemeTextInput({ className, style, ...props }, ref) {
    return (
      <TextInput
        {...props}
        className={className}
        ref={ref}
        style={withDefaultFontStyle({ className, style })}
      />
    )
  }
)
