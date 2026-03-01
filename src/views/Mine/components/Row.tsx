import { Text, View } from 'react-native'
import MCIIcon from 'react-native-vector-icons/MaterialCommunityIcons'

interface RowProps {
  label: string
}

export function Row({ label }: RowProps) {
  return (
    <View className="flex-row items-center justify-between border-b border-[#3a3e44] bg-[#2b3036] px-8 py-4">
      <Text className="text-xl text-white">{label}</Text>
      <MCIIcon
        name="chevron-right"
        size={24}
        color="#fff"
      />
    </View>
  )
}
