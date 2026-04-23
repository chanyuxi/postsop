import { Platform, StatusBar, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { tw } from '@/utils/style'

const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight : 0

export interface StatusBarPlaceholderProps {
  className?: string
}

export function StatusBarPlaceholder({ className }: StatusBarPlaceholderProps) {
  const insets = useSafeAreaInsets()

  return (
    <View
      className={tw('w-full', className)}
      style={{ height: statusBarHeight ?? insets.top }}
    />
  )
}
