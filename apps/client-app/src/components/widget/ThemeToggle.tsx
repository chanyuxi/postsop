import type { ReactNode } from 'react'
import { Pressable } from 'react-native'
import { Uniwind, useCSSVariable, useUniwind } from 'uniwind'

import { Icons } from '@/components/common'
import { persistTheme } from '@/utils/storage'
import { setTheme } from '@/utils/theme'

export function ThemeToggle() {
  const { theme, hasAdaptiveThemes } = useUniwind()

  const activeTheme = hasAdaptiveThemes ? 'system' : theme

  const [orange, yellow300] = useCSSVariable([
    '--color-orange-500',
    '--color-yellow-200',
  ]) as [string, string]

  const toggleTheme = () => {
    const newTheme = Uniwind.currentTheme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    persistTheme(newTheme)
  }

  let value: ReactNode
  switch (activeTheme) {
    case 'light':
      value = (
        <Icons
          color={orange}
          name="white-balance-sunny"
        />
      )
      break
    case 'dark':
      value = (
        <Icons
          color={yellow300}
          name="weather-night"
        />
      )
      break
    case 'system':
      value = <Icons name="palette-outline" />
      break
  }

  return <Pressable onPress={toggleTheme}>{value}</Pressable>
}
