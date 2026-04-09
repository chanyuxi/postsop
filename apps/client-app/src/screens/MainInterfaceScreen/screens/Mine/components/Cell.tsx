import { Pressable, View } from 'react-native'
import { useCSSVariable } from 'uniwind'

import { Icons } from '@/components/common/MaterialDesignIcons'
import { ThemeText } from '@/components/common/ThemeText'

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
        <Icons
          color={foregroundColor}
          name="chevron-right"
        />
      </View>
    </Pressable>
  )
}
