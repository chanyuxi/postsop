import { useNavigation } from '@react-navigation/native'
import { View } from 'react-native'
import { twMerge } from 'tailwind-merge'

import { useForegroundColor } from '@/hooks/useCssVariable'

import { Icons } from '../MaterialDesignIcons'
import { ThemeText } from '../ThemeText'

interface TitleBarProps {
  title: string
  className?: string
}

export function TitleBar({ title, className }: TitleBarProps) {
  const { goBack } = useNavigation()
  const foregroundColor = useForegroundColor()

  return (
    <View
      className={twMerge(
        'bg-background-light h-16 flex-row items-center px-4',
        className
      )}
    >
      <View className="w-20">
        <Icons
          name="chevron-left"
          size={30}
          color={foregroundColor}
          onPress={() => goBack()}
        />
      </View>
      <View className="flex-1">
        <ThemeText className="text-center text-xl">{title}</ThemeText>
      </View>
      <View className="w-20" />
    </View>
  )
}
