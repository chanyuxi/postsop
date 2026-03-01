import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons'
import { Pressable, Text, View } from 'react-native'

interface RowProps {
  label: string
  onPress?: () => void
}

export function Cell({ label, onPress }: RowProps) {
  return (
    <Pressable onPress={onPress}>
      <View className="flex-row items-center justify-between px-8 py-4">
        <Text className="text-xl text-white">{label}</Text>
        <MaterialDesignIcons
          name="chevron-right"
          size={24}
          color="#fff"
        />
      </View>
    </Pressable>
  )
}
