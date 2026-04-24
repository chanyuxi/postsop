import { Platform, StatusBar } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const statusBarHeightIfAndroid =
  Platform.OS === 'android' ? StatusBar.currentHeight : 0

export function useSatusBarHeight() {
  const { top } = useSafeAreaInsets()

  return statusBarHeightIfAndroid || top
}
