import { TextInput, type TextInputProps, View } from 'react-native'
import { twMerge } from 'tailwind-merge'

import { type Controllability, withAutoControl } from './core'

interface InputProps
  extends Controllability<string>, Omit<TextInputProps, 'value' | 'onChange'> {
  inputClassName?: string
}

export const Input = withAutoControl(function (props: InputProps) {
  const { className, inputClassName, ...restProps } = props

  return (
    <View
      className={twMerge('rounded border border-white px-4 py-1', className)}
    >
      <TextInput
        className={twMerge('text-foreground', inputClassName)}
        {...restProps}
        value={props.value}
        onChange={(e) => props.onChange?.(e.nativeEvent.text)}
      />
    </View>
  )
})
