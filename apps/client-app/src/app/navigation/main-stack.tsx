import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { MainTabsScreen } from '@/screens/system/main-tabs-screen'
import { SettingScreen } from '@/screens/system/setting-screen'

import type { MainStackParamList } from './types'

const Stack = createNativeStackNavigator<MainStackParamList>()

export function MainStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        component={MainTabsScreen}
        name="MainTabs"
      />
      <Stack.Screen
        component={SettingScreen}
        name="Setting"
      />
    </Stack.Navigator>
  )
}
