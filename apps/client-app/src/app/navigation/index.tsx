import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { ActivityIndicator, View } from 'react-native'
import { useUniwind } from 'uniwind'

import { useAuth } from '@/hooks/use-auth'

import { AuthStack } from './auth-stack'
import { MainStack } from './main-stack'
import type { RootStackParamList } from './types'
import { useNavigationPersistence } from './use-navigation-persistence'

const Stack = createNativeStackNavigator<RootStackParamList>()

export function AppNavigation() {
  const { theme } = useUniwind()
  const { isSignIn } = useAuth()
  const { initialState, isReady, persistState } = useNavigationPersistence()

  if (!isReady) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator />
      </View>
    )
  }

  return (
    <NavigationContainer
      initialState={initialState}
      onStateChange={persistState}
      theme={theme === 'dark' ? DarkTheme : DefaultTheme}
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
