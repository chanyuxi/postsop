import { StatusBar } from 'react-native'
import { Uniwind } from 'uniwind'

export type ThemeName = 'light' | 'dark' | 'system'

const BarStyleMap = {
  light: 'dark-content',
  dark: 'light-content',
  system: 'default',
} as const

export function setTheme(theme: ThemeName) {
  Uniwind.setTheme(theme)
  StatusBar.setBarStyle(BarStyleMap[theme])
}
