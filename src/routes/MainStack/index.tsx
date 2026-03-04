import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { MainInterfaceScreen } from '@/screens/MainInterface'
import { SettingScreen } from '@/screens/Setting'

import { MainStackParamList } from '../type'

const Stack = createNativeStackNavigator<MainStackParamList>()
export function MainStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="MainInterface"
        component={MainInterfaceScreen}
      />
      <Stack.Screen
        name="Setting"
        component={SettingScreen}
      />
    </Stack.Navigator>
  )
}
