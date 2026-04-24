import { View } from 'react-native'

import { useSatusBarHeight } from '@/hooks'
import { tw } from '@/utils/style'

export interface StatusBarPlaceholderProps {
  className?: string
}

export function StatusBarPlaceholder({ className }: StatusBarPlaceholderProps) {
  const height = useSatusBarHeight()

  return (
    <View
      className={tw('w-full', className)}
      style={{ height }}
    />
  )
}
