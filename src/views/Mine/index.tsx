import { Text, View } from 'react-native'

import { BackgroundView } from '@/components/BackgroundView'
import { StatusBarPlaceholder } from '@/components/StatusBarPlaceholder'

import { Row } from './components/Row'

export function Mine() {
  return (
    <BackgroundView backgroundColor="#24292e">
      <StatusBarPlaceholder backgroundColor="#2b3036" />

      <View className="mb-4 bg-[#2b3036] p-8">
        <Text className="mb-2 text-4xl text-white">Seven Star</Text>
        <Text className="text-slate-300">
          Without action, dreams will always remain dreams
        </Text>
      </View>

      <Row label="Profile" />
      <Row label="Post" />
      <Row label="About" />
      <Row label="Setting" />
    </BackgroundView>
  )
}
