import type { PropsWithChildren } from 'react'
import { View } from 'react-native'
import { twMerge } from 'tailwind-merge'

import { StatusBarPlaceholder } from '../StatusBarPlaceholder'

interface ScreenWrapperProps {
  contentClassName?: string
  statusBarClassName?: string
}

export function ScreenWrapper({
  contentClassName,
  statusBarClassName,
  children,
}: PropsWithChildren<ScreenWrapperProps>) {
  return (
    <View className="bg-background flex-1">
      <StatusBarPlaceholder className={statusBarClassName} />

      <View className={twMerge('flex-1', contentClassName)}>{children}</View>
    </View>
  )
}
