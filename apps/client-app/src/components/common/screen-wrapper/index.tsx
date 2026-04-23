import type { PropsWithChildren, ReactNode } from 'react'
import { StatusBar, View } from 'react-native'

import { IS_ANDROID_AND_VERSION_LARGER_THAN_OR_EQUAL_TO_35 } from '@/constants'
import { tw } from '@/utils/style'

import { StatusBarPlaceholder } from '../status-bar-placeholder'

interface ScreenWrapperProps {
  className?: string
  contentClassName?: string
  statusBarClassName?: string
  /**
   * Provide rendering areas outside of the content
   */
  backgroundRender?: ReactNode
}

export function ScreenWrapper({
  className,
  contentClassName,
  statusBarClassName,
  backgroundRender,
  children,
}: PropsWithChildren<ScreenWrapperProps>) {
  // Given the introduction of Android edge-to-edge mode, we will uniformly
  // use custom <StatusBarPlaceholder /> to manage the status bar
  const ConfigureStatusBar =
    !IS_ANDROID_AND_VERSION_LARGER_THAN_OR_EQUAL_TO_35 && (
      <StatusBar
        translucent
        backgroundColor="transparent"
      />
    )

  return (
    <View className={tw('bg-background relative flex-1', className)}>
      {ConfigureStatusBar}
      <StatusBarPlaceholder className={statusBarClassName} />

      {/* Provide rendering areas outside of the content */}
      {backgroundRender}

      {/* Content */}
      <View className={tw('flex-1', contentClassName)}>{children}</View>
    </View>
  )
}
