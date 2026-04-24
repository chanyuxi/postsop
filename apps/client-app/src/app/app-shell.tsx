import { View } from 'react-native'

import {
  useFocusManager,
  useOnlineStateManager,
  useSafeAreaStyles,
} from '@/hooks'
import { NotificationAnchor } from '@/libs/notification/notification-anchor'
import { ToastAnchor } from '@/libs/toast/toast-anchor'

import { AppNavigation } from './navigation'
import { useAppBootstrap } from './use-app-bootstrap'

export function AppShell() {
  const safeAreaStyles = useSafeAreaStyles()

  useFocusManager()
  useOnlineStateManager()
  useAppBootstrap()

  return (
    <>
      <View
        className="bg-background flex-1"
        style={safeAreaStyles}
      >
        <AppNavigation />
      </View>
      <NotificationAnchor />
      <ToastAnchor />
    </>
  )
}
