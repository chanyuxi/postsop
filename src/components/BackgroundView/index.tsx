import { PropsWithChildren } from 'react'
import { View } from 'react-native'
import { twMerge } from 'tailwind-merge'

interface BackgroundViewProps {
  className?: string
  backgroundColor?: string
}

export function BackgroundView({
  className,
  children,
}: PropsWithChildren<BackgroundViewProps>) {
  return (
    <View className={twMerge('bg-background flex-1', className)}>
      {children}
    </View>
  )
}
