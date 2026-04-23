import { useCSSVariable } from 'uniwind'

import type { IconsName } from '@/components/common/material-design-icons'
import { Icons } from '@/components/common/material-design-icons'

export interface TabIconProps {
  focused: boolean
  size: number
  name: IconsName
}

export function TabIcon({ focused, size, name }: TabIconProps) {
  const [focusedColor, unfocusedColor] = useCSSVariable([
    '--color-brand-primary',
    '--color-foreground',
  ]) as [string, string]

  return (
    <Icons
      color={focused ? focusedColor : unfocusedColor}
      name={name}
      size={size}
    />
  )
}
