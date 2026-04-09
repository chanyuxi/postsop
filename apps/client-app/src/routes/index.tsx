import AsyncStorage from '@react-native-async-storage/async-storage'
import type { NavigationState } from '@react-navigation/native'
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { useEffect, useState } from 'react'
import { ActivityIndicator, Linking } from 'react-native'
import { useUniwind } from 'uniwind'

import { PERSISTENCE_KEY } from '@/constants/keys'
import { useAuth } from '@/hooks/useAuth'

import { AuthStack } from './AuthStack'
import { MainStack } from './MainStack'
import type { RootStackParamList } from './type'

const Stack = createNativeStackNavigator<RootStackParamList>()

export function RootStack() {
  const { theme } = useUniwind()
  const { isSignIn } = useAuth()

  const [isReady, setIsReady] = useState(__DEV__ ? false : true)
  const [initialState, setInitialState] = useState<NavigationState>()

  useEffect(() => {
    const restoreState = async () => {
      const initialUrl = await Linking.getInitialURL()

      if (initialUrl == null) {
        let savedState: string | null = null
        let state: NavigationState | undefined

        try {
          savedState = await AsyncStorage.getItem(PERSISTENCE_KEY)
        } catch (error) {
          console.error('Failed to restore navigation state', error)
        }

        if (savedState) {
          try {
            state = JSON.parse(savedState) as NavigationState
            setInitialState(state)
          } catch (error) {
            console.error('Failed to parse navigation state', error)
          }
        }
      }

      setIsReady(true)
    }

    restoreState()
  }, [isReady])

  if (!isReady) {
    return <ActivityIndicator />
  }

  return (
    <NavigationContainer
      initialState={initialState}
      theme={theme === 'dark' ? DarkTheme : DefaultTheme}
      onStateChange={(state) =>
        AsyncStorage.setItem(PERSISTENCE_KEY, JSON.stringify(state))
      }
    >
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isSignIn ? (
          <Stack.Screen
            component={MainStack}
            name="Main"
          />
        ) : (
          <Stack.Screen
            component={AuthStack}
            name="Auth"
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  )
}
