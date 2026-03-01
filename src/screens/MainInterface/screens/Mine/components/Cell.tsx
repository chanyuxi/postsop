import { Pressable, Text, View } from 'react-native'

import { Icons } from '@/components/common/MaterialDesignIcons'

interface RowProps {
  label: string
  onPress?: () => void
}

export function Cell({ label, onPress }: RowProps) {
  return (
    <Pressable onPress={onPress}>
      <View className="flex-row items-center justify-between px-8 py-4">
        <Text className="text-xl text-white">{label}</Text>
        <Icons
          name="chevron-right"
          size={24}
          color="#fff"
        />
      </View>
    </Pressable>
  )
}
