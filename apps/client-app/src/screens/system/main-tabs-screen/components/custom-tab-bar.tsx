import type { BottomTabBarProps } from '@react-navigation/bottom-tabs'
import { Pressable, View } from 'react-native'

import { TabIcon } from './tab-icon'

const tabItemIconNameMap = {
  Post: 'alpha-t-circle-outline',
  QuietMode: 'alarm',
  Account: 'account-circle-outline',
} as const

export function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  return (
    <View className="bg-background-bottom-bar flex-row items-center">
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
            className="h-[60] flex-1 items-center justify-center"
            key={route.key}
            onPress={handlePress}
          >
            <TabIcon
              focused={isFocused}
              name={
                tabItemIconNameMap[
                  route.name as keyof typeof tabItemIconNameMap
                ]
              }
              size={26}
            />
          </Pressable>
        )
      })}
    </View>
  )
}
