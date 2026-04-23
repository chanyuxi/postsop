import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

import type { MainInterfaceTabParamList } from '@/routes/type'

import { CustomTabBar } from './components/custom-tab-bar'
import { Home } from './screens/home'
import { Mine } from './screens/mine'
import { QuietMode } from './screens/quiet-mode'

const Tab = createBottomTabNavigator<MainInterfaceTabParamList>()

export function MainInterfaceScreen() {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={CustomTabBar}
    >
      <Tab.Screen
        component={Home}
        name="Home"
      />
      <Tab.Screen
        component={QuietMode}
        name="QuietMode"
      />
      <Tab.Screen
        component={Mine}
        name="Mine"
      />
    </Tab.Navigator>
  )
}
