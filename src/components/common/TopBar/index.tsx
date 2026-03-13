import { useNavigation } from '@react-navigation/native'
import { Pressable, View } from 'react-native'
import { twMerge } from 'tailwind-merge'
import { useCSSVariable } from 'uniwind'

import { Icons } from '../MaterialDesignIcons'
import { ThemeText } from '../ThemeText'

interface TopBarProps {
  className?: string
  title: string
  hideBackButton?: boolean
  rightIcon?: React.ReactNode
  onPressRightIcon?: () => void
}

export function TopBar(props: TopBarProps) {
  const { className, title, hideBackButton, rightIcon, onPressRightIcon } =
    props

  const { goBack } = useNavigation()
  const foregroundColor = useCSSVariable('--color-foreground') as string

  return (
    <View className={twMerge('bg-background-secondary pt-4 pb-6', className)}>
      <View className="flex-row items-center px-4">
        <View className="w-20">
          {!hideBackButton && (
            <Pressable onPress={() => goBack()}>
              <Icons
                name="chevron-left"
                size={30}
                color={foregroundColor}
              />
            </Pressable>
          )}
        </View>

        <View className="flex-1">
          <ThemeText className="text-center text-xl">{title}</ThemeText>
        </View>

        <View className="w-20">
          {rightIcon && (
            <Pressable
              className="flex-row justify-end"
              onPress={onPressRightIcon}
            >
              {rightIcon}
            </Pressable>
          )}
        </View>
      </View>
    </View>
  )
}
