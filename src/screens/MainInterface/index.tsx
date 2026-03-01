import {
  type BottomTabBarProps,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs'
import { type ComponentType } from 'react'
import { Pressable, View } from 'react-native'

import { type IconsName } from '@/components/common/MaterialDesignIcons'

import { TabIcon } from './components/TabIcon'
import { Home } from './screens/Home'
import { Mine } from './screens/Mine'
import { QuietMode } from './screens/QuietMode'

type tabItemIconNameMapValue = { icon: IconsName; screen: ComponentType }

const Tab = createBottomTabNavigator()

const tabItemIconNameMap: Record<string, tabItemIconNameMapValue> = {
  Home: {
    icon: 'alpha-t-circle-outline',
    screen: Home,
  },
  QuietMode: {
    icon: 'alarm',
    screen: QuietMode,
  },
  Mine: {
    icon: 'account-circle-outline',
    screen: Mine,
  },
}

function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  return (
    <View className="bg-background-dark h-[60] flex-row items-center">
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
              name={tabItemIconNameMap[route.name].icon}
            />
          </Pressable>
        )
      })}
    </View>
  )
}

export function MainInterfaceScreen() {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={CustomTabBar}
    >
      {Object.entries(tabItemIconNameMap).map(([name, { screen }]) => (
        <Tab.Screen
          key={name}
          name={name}
          component={screen}
        />
      ))}
    </Tab.Navigator>
  )
}
