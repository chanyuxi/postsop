import type { ReactNode } from 'react'
import { Pressable, View } from 'react-native'

import { ThemeText } from '@/components/common'

interface ConfigItemProps {
  label: ReactNode
  value?: ReactNode
  description: ReactNode

  onPress?: () => void
}

export function ConfigItem(props: ConfigItemProps) {
  const { label, value, description, onPress } = props

  return (
    <Pressable
      className="bg-background-secondary flex-row items-center justify-between rounded-lg p-4"
      onPress={onPress}
    >
      <View>
        <ThemeText>{label}</ThemeText>
        <ThemeText className="text-foreground-secondary text-sm">
          {description}
        </ThemeText>
      </View>

      <View>
        <ThemeText>{value}</ThemeText>
      </View>
    </Pressable>
  )
}
