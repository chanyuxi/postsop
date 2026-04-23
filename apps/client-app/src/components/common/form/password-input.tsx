import { useState } from 'react'
import { Pressable, View } from 'react-native'

import { Icons } from '../material-design-icons'
import type { InputProps } from './input'
import { Input } from './input'

export interface PasswordInputProps extends Omit<
  InputProps,
  'secureTextEntry'
> {
  defaultVisible?: boolean
}

export function PasswordInput({
  defaultVisible = false,
  editable,
  suffix,
  ...props
}: PasswordInputProps) {
  const [visible, setVisible] = useState(defaultVisible)

  return (
    <Input
      {...props}
      editable={editable}
      secureTextEntry={!visible}
      suffix={
        <View className="flex-row items-center gap-2">
          {suffix}
          <Pressable
            disabled={editable === false}
            hitSlop={8}
            onPress={() => setVisible((current) => !current)}
          >
            <Icons
              name={visible ? 'eye-off-outline' : 'eye-outline'}
              size={20}
            />
          </Pressable>
        </View>
      }
    />
  )
}
