import type { ReactNode } from 'react'
import { useState } from 'react'
import type { TextInputProps } from 'react-native'
import { View } from 'react-native'
import type { VariantProps } from 'tailwind-variants'
import { tv } from 'tailwind-variants'

import { tw } from '@/utils/style'

import { ThemeTextInput } from '../theme-text-input'
import type { Controllability } from './core'
import { withAutoControl } from './core'

export interface InputProps
  extends
    Controllability<string>,
    Omit<TextInputProps, 'value' | 'onChange'>,
    VariantProps<typeof inputVariants> {
  inputClassName?: string
  isError?: boolean
  prefix?: ReactNode
  suffix?: ReactNode
}

const inputVariants = tv({
  slots: {
    wrapper: 'bg-input flex-row items-center rounded-lg px-4',
    input: 'text-foreground flex-1 text-base font-semibold',
  },
  variants: {
    size: {
      sm: { input: 'h-12 text-base' },
      md: { input: 'h-13 text-lg' },
      lg: { input: 'h-14 text-xl' },
    },
    variant: {
      'hollowed-out': {
        wrapper: 'border-input-border border bg-transparent',
      },
    },
    focused: {
      true: {
        wrapper: 'border-brand-blue',
      },
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

export const Input = withAutoControl(function (props: InputProps) {
  const [focused, setFocused] = useState(false)
  const {
    className,
    inputClassName,
    isError,
    size,
    variant,
    prefix,
    suffix,
    onBlur,
    onFocus,
    ...restProps
  } = props

  const { wrapper, input } = inputVariants({ size, variant, focused })

  const handleFocus: TextInputProps['onFocus'] = (event) => {
    setFocused(true)
    onFocus?.(event)
  }

  const handleBlur: TextInputProps['onBlur'] = (event) => {
    setFocused(false)
    onBlur?.(event)
  }

  return (
    <View
      className={wrapper({
        className: tw(isError && 'border-brand-danger', className),
      })}
    >
      {prefix && <View className="mr-2">{prefix}</View>}

      <ThemeTextInput
        className={input({ className: inputClassName })}
        {...restProps}
        onBlur={handleBlur}
        value={props.value}
        onChange={(e) => props.onChange?.(e.nativeEvent.text)}
        onFocus={handleFocus}
      />

      {suffix && <View className="ml-2">{suffix}</View>}
    </View>
  )
})
