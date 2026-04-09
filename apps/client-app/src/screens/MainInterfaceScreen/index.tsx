import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

import type { MainInterfaceTabParamList } from '@/routes/type'

import { CustomTabBar } from './components/CustomTabBar'
import { Home } from './screens/Home'
import { Mine } from './screens/Mine'
import { QuietMode } from './screens/QuietMode'

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
