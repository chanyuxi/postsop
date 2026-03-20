import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { SignInScreen } from '@/screens/SignInScreen'

import { type AuthStackParamList } from '../type'

const Stack = createNativeStackNavigator<AuthStackParamList>()
export function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        component={SignInScreen}
        name="SignIn"
      />
    </Stack.Navigator>
  )
}
