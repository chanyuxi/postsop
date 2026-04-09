import type { ReactNode } from 'react'
import { TextInput, type TextInputProps, View } from 'react-native'
import { tv, type VariantProps } from 'tailwind-variants'

import { type Controllability, withAutoControl } from './core'

interface InputProps
  extends
    Controllability<string>,
    Omit<TextInputProps, 'value' | 'onChange'>,
    VariantProps<typeof inputVariants> {
  inputClassName?: string

  prefix?: ReactNode
  suffix?: ReactNode
}

const inputVariants = tv({
  slots: {
    wrapper: 'bg-input flex-row items-center rounded-lg px-4',
    input: 'text-foreground flex-1 text-base',
  },
  variants: {
    size: {
      sm: { input: 'text-sm' },
      md: { input: 'h-12 text-base' },
      lg: { input: 'text-lg' },
    },
  },
})

export const Input = withAutoControl(function (props: InputProps) {
  const { className, inputClassName, size, ...restProps } = props

  const { wrapper, input } = inputVariants({ size })

  return (
    <View className={wrapper({ className })}>
      {props.prefix && <View className="mr-2">{props.prefix}</View>}

      <TextInput
        className={input({ className: inputClassName })}
        {...restProps}
        value={props.value}
        onChange={(e) => props.onChange?.(e.nativeEvent.text)}
      />

      {props.suffix && <View className="mr-2">{props.prefix}</View>}
    </View>
  )
})
