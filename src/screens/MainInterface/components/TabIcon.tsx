import { useCSSVariable } from 'uniwind'

import { Icons, type IconsName } from '@/components/common/MaterialDesignIcons'

interface TabIconProps {
  focused: boolean
  size: number
  name: IconsName
}

export function TabIcon({ focused, size, name }: TabIconProps) {
  const focusedColor = useCSSVariable('--color-primary') as string

  return (
    <Icons
      size={size}
      name={name}
      color={focused ? focusedColor : '#fff'}
    />
  )
}
