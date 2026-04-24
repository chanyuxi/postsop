import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { SignInScreen } from '@/screens/auth/sign-in-screen'
import { SignUpScreen } from '@/screens/auth/sign-up-screen'

import type { AuthStackParamList } from './types'

const Stack = createNativeStackNavigator<AuthStackParamList>()

export function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        component={SignInScreen}
        name="SignIn"
      />
      <Stack.Screen
        component={SignUpScreen}
        name="SignUp"
      />
    </Stack.Navigator>
  )
}
