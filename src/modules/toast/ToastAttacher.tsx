import { useEffect } from 'react'
import { Button, Text, View } from 'react-native'
import Animated, {
  Easing,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated'

import { useAppDispatch, useAppSelector } from '@/hooks/useStore'
import { addToast, removeToast } from '@/store/systemSlice'

interface ToastProps {
  id: string
}

function Toast({ id }: ToastProps) {
  const dispatch = useAppDispatch()
  const enter = useSharedValue(0)
  const exit = useSharedValue(0)

  const animatedStyle = useAnimatedStyle(() => {
    const opacity = enter.value * (1 - exit.value)
    const scale = interpolate(enter.value, [0, 1], [0.25, 1])
    const translateY = interpolate(enter.value, [0, 1], [20, 0])
    return {
      opacity,
      transform: [{ scale }, { translateY }],
    }
  })

  useEffect(() => {
    const dispatchRemove = () => dispatch(removeToast(id))

    const enterAnimation = withTiming(1, {
      duration: 300,
      easing: Easing.inOut(Easing.ease),
    })

    const exitAnimation = withTiming(
      1,
      { duration: 300, easing: Easing.out(Easing.ease) },
      (finished) => {
        if (finished) runOnJS(dispatchRemove)()
      }
    )

    enter.value = withSequence(enterAnimation, withTiming(1, { duration: 0 }))
    exit.value = withDelay(2000, exitAnimation)
  }, [enter, exit, dispatch, id])

  return (
    <Animated.View
      style={animatedStyle}
      className="mx-auto h-10 min-w-25 items-center justify-center rounded-full bg-white px-4 shadow-lg"
    >
      <Text>Toast</Text>
    </Animated.View>
  )
}

export function ToastAttacher() {
  const toasts = useAppSelector((state) => state.system.toasts)
  const dispatch = useAppDispatch()

  return (
    <View>
      <Button
        title="show"
        onPress={() => dispatch(addToast('Hello Toast'))}
      />
      <View className="absolute right-0 bottom-0 left-0 gap-3 pb-20">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            id={toast.id}
          />
        ))}
      </View>
    </View>
  )
}
