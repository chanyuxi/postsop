import AsyncStorage from '@react-native-async-storage/async-storage'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { useEffect, useState } from 'react'
import { ActivityIndicator, Linking } from 'react-native'

import { PERSISTENCE_KEY } from '@/constants'
import { LoginScreen } from '@/screens/Login'
import { MainInterfaceScreen } from '@/screens/MainInterface'

const Stack = createStackNavigator()

function StackRoot() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="MainInterface"
        component={MainInterfaceScreen}
      />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
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
