import { Platform, StatusBar, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight : 0

export interface StatusBarPlaceholderProps {
  backgroundColor?: string
}

export function StatusBarPlaceholder({
  backgroundColor = 'transparent',
}: StatusBarPlaceholderProps) {
  const insets = useSafeAreaInsets()

  return (
    <View
      className="w-full"
      style={{ height: statusBarHeight || insets.top, backgroundColor }}
    />
  )
}
