import type { MaterialDesignIconsIconName } from '@react-native-vector-icons/material-design-icons'
import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons'
import type { GestureResponderEvent } from 'react-native'
import { useCSSVariable } from 'uniwind'

export interface IconsProps {
  name: MaterialDesignIconsIconName
  size?: number
  color?: string
  onPress?: (event: GestureResponderEvent) => void
}

function Icons({ name, size = 24, color, onPress }: IconsProps) {
  const foreground = useCSSVariable('--color-foreground') as string

  return (
    <MaterialDesignIcons
      color={color ?? foreground}
      name={name}
      size={size}
      onPress={onPress}
    />
  )
}

export { Icons, type MaterialDesignIconsIconName as IconsName }
