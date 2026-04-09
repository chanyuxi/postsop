import { useSafeAreaInsets } from 'react-native-safe-area-context'

export function useSafeAreaStyles() {
  const safeAreaInsets = useSafeAreaInsets()

  const safeAreaStyles = {
    paddingLeft: safeAreaInsets.left,
    /**
     * In Android devices, the status bar after version 35 cannot be
     * colored, and compatibility with both scenarios will result in
     * some cumbersome code. Therefore, I am considering implementing
     * a custom status bar placeholder component, where padding Top
     * is no longer needed.
     */
    paddingTop: 0,
    paddingRight: safeAreaInsets.right,
    paddingBottom: safeAreaInsets.bottom,
  }

  return safeAreaStyles
}
