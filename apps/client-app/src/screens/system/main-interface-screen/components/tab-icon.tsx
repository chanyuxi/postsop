import type { MaterialDesignIconsIconName } from '@react-native-vector-icons/material-design-icons'
import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons'
import { useCSSVariable } from 'uniwind'

export interface TabIconProps {
  focused: boolean
  size: number
  name: MaterialDesignIconsIconName
}

export function TabIcon({ focused, size, name }: TabIconProps) {
  const [focusedColor, unfocusedColor] = useCSSVariable([
    '--color-brand-primary',
    '--color-foreground',
  ]) as [string, string]

  return (
    <MaterialDesignIcons
      color={focused ? focusedColor : unfocusedColor}
      name={name}
      size={size}
    />
  )
}
