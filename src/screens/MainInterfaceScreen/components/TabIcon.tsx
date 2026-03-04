import { Icons, type IconsName } from '@/components/common/MaterialDesignIcons'
import { useForegroundColor, usePrimaryColor } from '@/hooks/useCssVariable'

interface TabIconProps {
  focused: boolean
  size: number
  name: IconsName
}

export function TabIcon({ focused, size, name }: TabIconProps) {
  const focusedColor = usePrimaryColor()
  const unfocusedColor = useForegroundColor()

  return (
    <Icons
      size={size}
      name={name}
      color={focused ? focusedColor : unfocusedColor}
    />
  )
}
