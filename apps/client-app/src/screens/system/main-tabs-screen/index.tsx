import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

import type { MainTabsParamList } from '@/app/navigation/types'

import { CustomTabBar } from './components/custom-tab-bar'
import { AccountScreen } from './tabs/account-screen'
import { PostScreen } from './tabs/post-screen'
import { QuietModeScreen } from './tabs/quiet-mode-screen'

const Tab = createBottomTabNavigator<MainTabsParamList>()

export function MainTabsScreen() {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={CustomTabBar}
    >
      <Tab.Screen
        component={PostScreen}
        name="Post"
      />
      <Tab.Screen
        component={QuietModeScreen}
        name="QuietMode"
      />
      <Tab.Screen
        component={AccountScreen}
        name="Account"
      />
    </Tab.Navigator>
  )
}
