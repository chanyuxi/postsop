import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { ActivityIndicator } from 'react-native'

import { Button, ScreenWrapper, ThemeText } from '@/components/common'
import { MainTabsScreen } from '@/screens/system/main-tabs-screen'
import { SettingScreen } from '@/screens/system/setting-screen'
import { SetupProfileScreen } from '@/screens/system/setup-profile-screen'
import { useProfileStatusQuery } from '@/services/user/queries'

import type { MainStackParamList } from './types'

const Stack = createNativeStackNavigator<MainStackParamList>()

export function MainStack() {
  const profileStatusQuery = useProfileStatusQuery()

  if (profileStatusQuery.isPending) {
    return (
      <ScreenWrapper className="items-center justify-center">
        <ActivityIndicator />
      </ScreenWrapper>
    )
  }

  if (profileStatusQuery.error) {
    return (
      <ScreenWrapper contentClassName="items-center justify-center gap-4 p-6">
        <ThemeText className="text-center">
          Failed to load profile status
        </ThemeText>

        <Button onPress={() => profileStatusQuery.refetch()}>Retry</Button>
      </ScreenWrapper>
    )
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        component={SetupProfileScreen}
        name="SetupProfile"
      />

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
