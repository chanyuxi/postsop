import { useEffect } from 'react'
import type { ViewProps } from 'react-native'
import { View } from 'react-native'
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated'

import { tw } from '@/utils/style'

interface AmbientOrbProps extends Pick<ViewProps, 'pointerEvents'> {
  duration: number
  initialProgress?: number
  opacity: [number, number, number]
  orbClassName?: string
  scale: [number, number, number]
  travelX: [number, number, number]
  travelY: [number, number, number]
  wrapperClassName?: string
}

export function AmbientOrb({
  duration,
  initialProgress = 0,
  opacity,
  orbClassName,
  pointerEvents = 'none',
  scale,
  travelX,
  travelY,
  wrapperClassName,
}: AmbientOrbProps) {
  const progress = useSharedValue(initialProgress)

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(initialProgress === 0 ? 1 : 0, {
        duration,
        easing: Easing.inOut(Easing.quad),
      }),
      -1,
      true
    )
  }, [duration, initialProgress, progress])

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 0.5, 1], opacity),
    transform: [
      {
        translateX: interpolate(progress.value, [0, 0.5, 1], travelX),
      },
      {
        translateY: interpolate(progress.value, [0, 0.5, 1], travelY),
      },
      {
        scale: interpolate(progress.value, [0, 0.5, 1], scale),
      },
    ],
  }))

  return (
    <View
      className={tw('absolute', wrapperClassName)}
      pointerEvents={pointerEvents}
    >
      <Animated.View style={animatedStyle}>
        <View className={tw('rounded-full', orbClassName)} />
      </Animated.View>
    </View>
  )
}
