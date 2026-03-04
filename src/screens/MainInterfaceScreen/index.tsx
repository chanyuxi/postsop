import {
  type BottomTabBarProps,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs'
import { Pressable, View } from 'react-native'

import { type IconsName } from '@/components/common/MaterialDesignIcons'

import { TabIcon } from './components/TabIcon'
import { Home } from './screens/Home'
import { Mine } from './screens/Mine'
import { QuietMode } from './screens/QuietMode'

export type MainInterfaceTabParamList = {
  Home: undefined
  QuietMode: undefined
  Mine: undefined
}

const Tab = createBottomTabNavigator<MainInterfaceTabParamList>()

const tabItemIconNameMap: Record<keyof MainInterfaceTabParamList, IconsName> = {
  Home: 'alpha-t-circle-outline',
  QuietMode: 'alarm',
  Mine: 'account-circle-outline',
}

function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  return (
    <View className="bg-background-tertiary h-[60] flex-row items-center">
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
                  route.name as keyof MainInterfaceTabParamList
                ]
              }
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
      <Tab.Screen
        name="Home"
        component={Home}
      />
      <Tab.Screen
        name="QuietMode"
        component={QuietMode}
      />
      <Tab.Screen
        name="Mine"
        component={Mine}
      />
    </Tab.Navigator>
  )
}
