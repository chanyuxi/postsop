import { PropsWithChildren } from 'react'
import { View } from 'react-native'
import { twMerge } from 'tailwind-merge'

import { StatusBarPlaceholder } from '../StatusBarPlaceholder'

interface BackgroundViewProps {
  contentClassName?: string
  statusBarClassName?: string
}

export function BackgroundView({
  contentClassName,
  statusBarClassName,
  children,
}: PropsWithChildren<BackgroundViewProps>) {
  return (
    <View className="bg-background flex-1">
      <StatusBarPlaceholder className={statusBarClassName} />

      <View className={twMerge('flex-1', contentClassName)}>{children}</View>
    </View>
  )
}
