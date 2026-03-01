import AsyncStorage from '@react-native-async-storage/async-storage'
import {
  MaterialDesignIcons,
  type MaterialDesignIconsIconName,
} from '@react-native-vector-icons/material-design-icons'
import {
  type BottomTabBarProps,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { useEffect, useState } from 'react'
import { ActivityIndicator, Linking, Pressable, View } from 'react-native'
import { useCSSVariable } from 'uniwind'

import { Home } from '@/views/Home'
import { Mine } from '@/views/Mine'
import { QuietMode } from '@/views/QuietMode'

const PERSISTENCE_KEY = 'NAVIGATION_STATE_V1'

const Tab = createBottomTabNavigator()

// reference from https://pictogrammers.com/library/mdi/
const tabItemIconNameMap: Record<string, MaterialDesignIconsIconName> = {
  Home: 'alpha-t-circle-outline',
  QuietMode: 'alarm',
  Mine: 'account-circle-outline',
}

interface CustomTabBarProps extends BottomTabBarProps {
  focusedColor: string
}

function CustomTabBar({ state, navigation, focusedColor }: CustomTabBarProps) {
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
            <MaterialDesignIcons
              size={26}
              name={tabItemIconNameMap[route.name]}
              color={isFocused ? focusedColor : '#fff'}
            />
          </Pressable>
        )
      })}
    </View>
  )
}

function MainInterface() {
  const primaryColor = useCSSVariable('--color-primary') as string

  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={(props) =>
        CustomTabBar({
          ...props,
          focusedColor: primaryColor,
        })
      }
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

const Stack = createStackNavigator()

function StackRoot() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="MainInterface"
        component={MainInterface}
      />
    </Stack.Navigator>
  )
}

export function RouteRender() {
  const [isReady, setIsReady] = useState(__DEV__ ? false : true)
  const [initialState, setInitialState] = useState()

  useEffect(() => {
    const restoreState = async () => {
      try {
        const initialUrl = await Linking.getInitialURL()

        if (initialUrl == null) {
          const savedState = await AsyncStorage.getItem(PERSISTENCE_KEY)
          const state = savedState ? JSON.parse(savedState) : undefined

          if (state !== undefined) {
            setInitialState(state)
          }
        }
      } finally {
        setIsReady(true)
      }
    }

    restoreState()
  }, [isReady])

  if (!isReady) {
    return <ActivityIndicator />
  }

  return (
    <NavigationContainer
      initialState={initialState}
      onStateChange={(state) =>
        AsyncStorage.setItem(PERSISTENCE_KEY, JSON.stringify(state))
      }
    >
      <StackRoot />
    </NavigationContainer>
  )
}
