import type { PropsWithChildren } from 'react'
import { View } from 'react-native'

interface CellGroupProps {
  className?: string
}

export function CellGroup({
  className,
  children,
}: PropsWithChildren<CellGroupProps>) {
  return <View className={className}>{children}</View>
}
