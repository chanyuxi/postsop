import type { ReactNode } from 'react'
import { Uniwind, useCSSVariable, useUniwind } from 'uniwind'

import { Icons } from '@/components/common'
import { storage, StrorageKeys } from '@/utils/storage'
import { setTheme } from '@/utils/theme'

import { ConfigItem } from './ConfigItem'

export function ThemeToggle() {
  const { theme, hasAdaptiveThemes } = useUniwind()

  const activeTheme = hasAdaptiveThemes ? 'system' : theme

  const orange = useCSSVariable('--color-orange-500') as string

  const toggleTheme = () => {
    const newTheme = Uniwind.currentTheme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    storage.set(StrorageKeys.THEME, newTheme)
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
      value = <Icons name="weather-night" />
      break
    case 'system':
      value = 'System'
      break
  }

  return (
    <ConfigItem
      label="Theme"
      description="set your favorite theme"
      value={value}
      onPress={toggleTheme}
    />
  )
}
