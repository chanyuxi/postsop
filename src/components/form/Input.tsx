import type { ReactNode } from 'react'
import { TextInput, type TextInputProps, View } from 'react-native'
import { twMerge } from 'tailwind-merge'

import { type Controllability, withAutoControl } from './core'

interface InputProps
  extends Controllability<string>, Omit<TextInputProps, 'value' | 'onChange'> {
  inputClassName?: string

  prefix?: ReactNode
  suffix?: ReactNode
}

export const Input = withAutoControl(function (props: InputProps) {
  const { className, inputClassName, ...restProps } = props

  return (
    <View
      className={twMerge(
        'bg-input flex-row items-center rounded-lg px-4 py-1',
        className
      )}
    >
      {props.prefix && <View className="mr-2">{props.prefix}</View>}

      <TextInput
        className={twMerge('text-foreground flex-1', inputClassName)}
        {...restProps}
        value={props.value}
        onChange={(e) => props.onChange?.(e.nativeEvent.text)}
      />

      {props.suffix && <View className="mr-2">{props.prefix}</View>}
    </View>
  )
})
