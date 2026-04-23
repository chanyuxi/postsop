import { Feather } from '@react-native-vector-icons/feather'
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
        <Feather
          color={orange500}
          name="sun"
          size={24}
        />
      )
      break
    case 'dark':
      value = (
        <Feather
          color={yellow300}
          name="moon"
          size={24}
        />
      )
      break
    case 'system':
      value = (
        <Feather
          color={foregroundColor}
          name="box"
          size={24}
        />
      )
      break
  }

  return <Pressable onPress={toggleTheme}>{value}</Pressable>
}
