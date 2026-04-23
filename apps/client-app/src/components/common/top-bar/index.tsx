import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons'
import { useNavigation } from '@react-navigation/native'
import { Pressable, View } from 'react-native'
import { useCSSVariable } from 'uniwind'

import { tw } from '@/utils/style'

import { ThemeText } from '../theme-text'

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
    <View className={tw('bg-background-secondary pt-4 pb-6', className)}>
      <View className="flex-row items-center px-4">
        <View className="w-20">
          {!hideBackButton && (
            <Pressable onPress={() => goBack()}>
              <MaterialDesignIcons
                color={foregroundColor}
                name="chevron-left"
                size={30}
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
