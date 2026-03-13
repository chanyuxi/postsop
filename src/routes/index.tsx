import AsyncStorage from '@react-native-async-storage/async-storage'
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { useEffect, useState } from 'react'
import { ActivityIndicator, Linking } from 'react-native'
import { useUniwind } from 'uniwind'

import { PERSISTENCE_KEY } from '@/constants'
import { useAuth } from '@/hooks/useAuth'

import { AuthStack } from './AuthStack'
import { MainStack } from './MainStack'
import { type RootStackParamList } from './type'

const Stack = createNativeStackNavigator<RootStackParamList>()
export function RootStack() {
  const { theme } = useUniwind()
  const { isSignIn } = useAuth()

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
      theme={theme === 'dark' ? DarkTheme : DefaultTheme}
      initialState={initialState}
      onStateChange={(state) =>
        AsyncStorage.setItem(PERSISTENCE_KEY, JSON.stringify(state))
      }
    >
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isSignIn ? (
          <Stack.Screen
            name="Main"
            component={MainStack}
          />
        ) : (
          <Stack.Screen
            name="Auth"
            component={AuthStack}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  )
}
