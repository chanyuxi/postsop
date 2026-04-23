import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons'
import { Pressable, View } from 'react-native'
import { useCSSVariable } from 'uniwind'

import { ThemeText } from '@/components/common/theme-text'

interface RowProps {
  label: string
  onPress?: () => void
}

export function Cell({ label, onPress }: RowProps) {
  const foregroundColor = useCSSVariable('--color-foreground') as string

  return (
    <Pressable onPress={onPress}>
      <View className="flex-row items-center justify-between px-8 py-4">
        <ThemeText className="text-xl">{label}</ThemeText>
        <MaterialDesignIcons
          color={foregroundColor}
          name="chevron-right"
        />
      </View>
    </Pressable>
  )
}
