import { Pressable, StatusBar, View } from 'react-native'
import { Uniwind, useUniwind } from 'uniwind'

import { ScreenWrapper } from '@/components/common/ScreenWrapper'
import { ThemeText } from '@/components/common/ThemeText'
import { TitleBar } from '@/components/common/TitleBar'

export function SettingScreen() {
  const { theme, hasAdaptiveThemes } = useUniwind()

  const activeTheme = hasAdaptiveThemes ? 'system' : theme

  const toggleTheme = () => {
    const isLightTheme = Uniwind.currentTheme === 'light'

    Uniwind.setTheme(isLightTheme ? 'dark' : 'light')
    StatusBar.setBarStyle(isLightTheme ? 'light-content' : 'dark-content')
  }

  return (
    <ScreenWrapper statusBarClassName="bg-background-secondary">
      <TitleBar title="SETTING" />

      <View className="p-6">
        <View className="flex-row gap-4">
          <Pressable
            onPress={toggleTheme}
            className="bg-background-secondary flex-1 rounded p-6"
          >
            <ThemeText>Theme - {activeTheme}</ThemeText>
          </Pressable>

          <View className="bg-background-secondary flex-1 rounded p-6">
            <ThemeText>Other</ThemeText>
          </View>
        </View>
      </View>
    </ScreenWrapper>
  )
}
