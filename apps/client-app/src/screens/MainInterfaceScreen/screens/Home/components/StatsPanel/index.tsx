import dayjs from 'dayjs'
import { View } from 'react-native'

import { ThemeText } from '@/components/common'

export function StatsPanel() {
  return (
    <View className="bg-background-secondary mb-4 rounded-lg p-4">
      <View className="flex-row justify-between">
        <View>
          <View className="mb-2 flex-row items-start justify-between">
            <ThemeText className="text-xl font-bold">TODAY</ThemeText>
            <ThemeText className="text-brand-gray-600 text-sm">
              {dayjs().format('YYYY/MM/DD')}
            </ThemeText>
          </View>

          <ThemeText className="mb-2 text-xl font-bold">
            Love never lies, every steadfast footprint gathers into the path of
            arrival.
          </ThemeText>

          <View className="flex-row items-end justify-end">
            <ThemeText className="text-3xl">4 / </ThemeText>
            <ThemeText className="text-5xl">13</ThemeText>
          </View>
        </View>
      </View>
    </View>
  )
}
