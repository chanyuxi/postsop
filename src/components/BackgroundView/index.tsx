import { PropsWithChildren } from 'react'
import { View } from 'react-native'

interface BackgroundViewProps {
  backgroundColor?: string
}

export function BackgroundView({
  children,
  backgroundColor = 'transparent',
}: PropsWithChildren<BackgroundViewProps>) {
  return (
    <View
      className="flex-1"
      style={{ backgroundColor }}
    >
      {children}
    </View>
  )
}
