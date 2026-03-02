import { Pressable, View } from 'react-native'

import { Icons } from '@/components/common/MaterialDesignIcons'
import { ThemeText } from '@/components/common/ThemeText'
import { useForegroundColor } from '@/hooks/useCssVariable'

interface RowProps {
  label: string
  onPress?: () => void
}

export function Cell({ label, onPress }: RowProps) {
  const foregroundColor = useForegroundColor()

  return (
    <Pressable onPress={onPress}>
      <View className="flex-row items-center justify-between px-8 py-4">
        <ThemeText className="text-xl">{label}</ThemeText>
        <Icons
          name="chevron-right"
          size={24}
          color={foregroundColor}
        />
      </View>
    </Pressable>
  )
}
