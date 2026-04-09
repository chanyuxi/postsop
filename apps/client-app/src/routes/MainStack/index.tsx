import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { MainInterfaceScreen } from '@/screens/MainInterfaceScreen'
import { SettingScreen } from '@/screens/SettingScreen'

import type { MainStackParamList } from '../type'

const Stack = createNativeStackNavigator<MainStackParamList>()
export function MainStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        component={MainInterfaceScreen}
        name="MainInterface"
      />
      <Stack.Screen
        component={SettingScreen}
        name="Setting"
      />
    </Stack.Navigator>
  )
}
