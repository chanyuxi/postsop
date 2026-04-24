import { useEffect, useSyncExternalStore } from 'react'
import { View } from 'react-native'
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated'
import { scheduleOnRN } from 'react-native-worklets'

import { ThemeText } from '@/components/common'
import { useIsSingletonComponent } from '@/hooks/use-is-singleton-component'

import type { Toast } from '.'
import { toastStore } from '.'

interface ToastProps {
  toast: Toast
}

function Toast({ toast }: ToastProps) {
  const { message, duration } = toast

  const enter = useSharedValue(0)
  const exit = useSharedValue(0)

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: enter.value * (1 - exit.value),
    transform: [
      {
        scale: interpolate(enter.value, [0, 1], [0.25, 1]),
      },
      {
        translateY: interpolate(enter.value, [0, 1], [20, 0]),
      },
    ],
  }))

  useEffect(() => {
    enter.value = withTiming(1, {
      duration: 100,
      easing: Easing.inOut(Easing.ease),
    })

    exit.value = withDelay(
      duration,
      withTiming(
        1,
        {
          duration: 300,
        },
        (finished) => {
          if (finished) scheduleOnRN(toastStore.dispose)
        }
      )
    )
  }, [enter, exit, duration])

  return (
    <Animated.View
      className="mx-auto h-10 min-w-25 items-center justify-center rounded-full bg-white px-4 shadow-lg"
      style={animatedStyle}
    >
      <ThemeText className="text-brand-black text-sm">{message}</ThemeText>
    </Animated.View>
  )
}

export function ToastAnchor() {
  const isSingleton = useIsSingletonComponent('ToastAnchor')
  const activatedToast = useSyncExternalStore(
    toastStore.subscribe,
    toastStore.getSnapshot
  )

  if (!isSingleton) {
    console.warn('ToastAnchor is mounted multiple times')
    return null
  }

  return (
    <View
      className="absolute right-0 bottom-0 left-0 gap-3 pb-30"
      pointerEvents="box-none"
    >
      {activatedToast && (
        <Toast
          key={activatedToast.id}
          toast={activatedToast}
        />
      )}
    </View>
  )
}
