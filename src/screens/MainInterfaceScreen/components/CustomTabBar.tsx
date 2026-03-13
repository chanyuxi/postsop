import type { BottomTabBarProps } from '@react-navigation/bottom-tabs'
import { Pressable, View } from 'react-native'

import { TabIcon } from './TabIcon'

const tabItemIconNameMap = {
  Home: 'alpha-t-circle-outline',
  QuietMode: 'alarm',
  Mine: 'account-circle-outline',
} as const

export function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  return (
    <View className="bg-background-bottom-bar h-[60] flex-row items-center">
      {state.routes.map((route, index) => {
        const isFocused = state.index === index

        const handlePress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          })

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params)
          }
        }

        return (
          <Pressable
            key={route.key}
            className="flex-1 items-center justify-center"
            onPress={handlePress}
          >
            <TabIcon
              focused={isFocused}
              size={26}
              name={
                tabItemIconNameMap[
                  route.name as keyof typeof tabItemIconNameMap
                ]
              }
            />
          </Pressable>
        )
      })}
    </View>
  )
}
