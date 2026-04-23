import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons'
import type { ReactNode } from 'react'
import { Pressable } from 'react-native'
import { Uniwind, useCSSVariable, useUniwind } from 'uniwind'

import { persistTheme } from '@/utils/storage'
import { setTheme } from '@/utils/theme'

export function ThemeToggle() {
  const { theme, hasAdaptiveThemes } = useUniwind()

  const activeTheme = hasAdaptiveThemes ? 'system' : theme

  const [foregroundColor, orange500, yellow300] = useCSSVariable([
    '--color-foreground',
    '--color-orange-500',
    '--color-yellow-200',
  ]) as [string, string, string]

  const toggleTheme = () => {
    const newTheme = Uniwind.currentTheme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    persistTheme(newTheme)
  }

  let value: ReactNode
  switch (activeTheme) {
    case 'light':
      value = (
        <MaterialDesignIcons
          color={orange500}
          name="white-balance-sunny"
        />
      )
      break
    case 'dark':
      value = (
        <MaterialDesignIcons
          color={yellow300}
          name="weather-night"
        />
      )
      break
    case 'system':
      value = (
        <MaterialDesignIcons
          color={foregroundColor}
          name="palette-outline"
        />
      )
      break
  }

  return <Pressable onPress={toggleTheme}>{value}</Pressable>
}
