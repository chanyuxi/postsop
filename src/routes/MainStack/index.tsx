import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { MainInterfaceScreen } from '@/screens/MainInterface'

import { MainStackParamList } from '../type'

const Stack = createNativeStackNavigator<MainStackParamList>()
export function MainStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="MainInterface"
        component={MainInterfaceScreen}
      />
    </Stack.Navigator>
  )
}
