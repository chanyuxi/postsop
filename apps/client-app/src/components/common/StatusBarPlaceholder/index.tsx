import { Platform, StatusBar, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { twMerge } from 'tailwind-merge'

const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight : 0

export interface StatusBarPlaceholderProps {
  className?: string
}

export function useStatusBarHeight() {
  const insets = useSafeAreaInsets()

  return statusBarHeight ?? insets.top
}

export function StatusBarPlaceholder({ className }: StatusBarPlaceholderProps) {
  const height = useStatusBarHeight()

  return (
    <View
      className={twMerge('w-full', className)}
      style={{ height }}
    />
  )
}
