import { useEffect, useRef, useState } from 'react'
import { Modal, Pressable, View } from 'react-native'
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { scheduleOnRN } from 'react-native-worklets'

import { tw } from '@/utils/style'

import { ThemeText } from '../theme-text'

interface ActionSheetOption {
  value: number
  label: string
}

interface ActionSheetProps {
  title: string
  visible: boolean
  options: ActionSheetOption[]
  maskClosable?: boolean
  onClose?: () => void
  value?: number | undefined
  onChange?: (value: number | undefined) => void
}

export function ActionSheet({
  title,
  visible,
  options,
  maskClosable,
  onClose,
  value,
  onChange,
}: ActionSheetProps) {
  const [isMounted, setIsMounted] = useState(visible)
  const [height, setHeight] = useState(0)
  const isClosing = useRef(false)

  const insets = useSafeAreaInsets()
  const animatedValue = useSharedValue(0)
  const maskStyle = useAnimatedStyle(() => ({
    opacity: animatedValue.get(),
  }))
  const cardStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: interpolate(animatedValue.value, [0, 1], [height, 0]) },
    ],
  }))

  const handleMaskPress = () => {
    if (maskClosable && !isClosing.current) {
      handleClose()
    }
  }

  const handleClose = () => {
    onClose?.()
  }

  const handleSelect = (option: ActionSheetOption) => {
    if (isClosing.current) {
      return
    }

    if (option.value === value) {
      return
    }

    onChange?.(option.value)
  }

  useEffect(() => {
    if (visible) {
      setIsMounted(true)
      isClosing.current = false
      animatedValue.value = withTiming(1)
      return
    }

    isClosing.current = true
    animatedValue.value = withTiming(0, undefined, (finished) => {
      if (finished) {
        scheduleOnRN(setIsMounted, false)
      }
    })
  }, [visible, animatedValue])

  return (
    <Modal
      visible={isMounted}
      animationType="none"
      transparent
      onRequestClose={handleClose}
    >
      <Animated.View
        className="flex-1"
        style={maskStyle}
      >
        <Pressable
          className="absolute inset-0"
          onPress={handleMaskPress}
        />

        <View className="flex-1 justify-end">
          <Animated.View
            className="rounded-t-xl bg-white px-6 pt-6"
            style={[
              cardStyle,
              {
                paddingBottom: Math.max(insets.bottom, 24),
              },
            ]}
            onLayout={(event) =>
              setHeight(Math.ceil(event.nativeEvent.layout.height))
            }
          >
            <View className="mb-2">
              <ThemeText className="text-center text-xl font-semibold">
                {title}
              </ThemeText>
            </View>

            {options.map((option) => (
              <Pressable
                key={option.value}
                className="py-2"
                onPress={() => handleSelect(option)}
              >
                <ThemeText
                  className={tw(
                    value === option.value && 'text-brand-primary font-semibold'
                  )}
                >
                  {option.label}
                </ThemeText>
              </Pressable>
            ))}
          </Animated.View>
        </View>
      </Animated.View>
    </Modal>
  )
}
