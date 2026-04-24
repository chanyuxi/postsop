import { useEffect, useEffectEvent, useSyncExternalStore } from 'react'
import { View } from 'react-native'
import type { PanGestureActiveEvent } from 'react-native-gesture-handler'
import { GestureDetector, usePanGesture } from 'react-native-gesture-handler'
import Animated, {
  Easing,
  Extrapolation,
  FadeInUp,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { scheduleOnRN } from 'react-native-worklets'

import { ThemeText } from '@/components/common'
import { useSatusBarHeight } from '@/hooks'
import { useIsSingletonComponent } from '@/hooks/use-is-singleton-component'
import { tw } from '@/utils/style'

import type { Notification } from '.'
import { notificationStore } from '.'

const SWIPE_DISMISS_DISTANCE = 56
const SWIPE_DISMISS_VELOCITY = -600
const SWIPE_OUT_DISTANCE = 140

const animationConfig = {
  duration: 180,
  easing: Easing.out(Easing.cubic),
}

const notificationAccentClassNames: Record<
  NonNullable<Notification['type']>,
  string
> = {
  danger: 'border-brand-danger',
  info: 'border-brand-primary',
  success: 'border-brand-success',
  warn: 'border-brand-warning',
}

function NotificationCard(props: { notification: Notification }) {
  const { notification } = props

  const translateY = useSharedValue(0)
  const isDismissing = useSharedValue(false)

  const dismiss = () => {
    'worklet'

    if (isDismissing.value) {
      return
    }

    isDismissing.value = true
    translateY.value = withTiming(
      SWIPE_OUT_DISTANCE * -1,
      animationConfig,
      () => {
        scheduleOnRN(notificationStore.dispose)
      }
    )
  }

  const dismissOnTimeout = useEffectEvent(() => {
    dismiss()
  })

  useEffect(() => {
    const duration = notification.duration

    if (typeof duration === 'number') {
      const timeoutRef = setTimeout(() => {
        dismissOnTimeout()
      }, duration)

      return () => {
        clearTimeout(timeoutRef)
      }
    }
  }, [notification.duration])

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      translateY.value,
      [0, SWIPE_OUT_DISTANCE * -1],
      [1, 0],
      Extrapolation.CLAMP
    ),
    transform: [
      {
        scale: interpolate(
          translateY.value,
          [0, SWIPE_OUT_DISTANCE * -1],
          [1, 0.75]
        ),
      },
      {
        translateY: translateY.value,
      },
    ],
  }))

  const pan = usePanGesture({
    activeOffsetY: [-8, 8],
    failOffsetX: [-24, 24],
    onUpdate: (event: PanGestureActiveEvent) => {
      'worklet'

      if (isDismissing.value) {
        return
      }

      translateY.value = Math.min(event.translationY, 0)
    },
    onDeactivate: (event: PanGestureActiveEvent) => {
      'worklet'

      if (isDismissing.value) {
        return
      }

      const shouldDismiss =
        event.translationY <= SWIPE_DISMISS_DISTANCE * -1 ||
        event.velocityY <= SWIPE_DISMISS_VELOCITY

      if (shouldDismiss) {
        dismiss()
        return
      }

      translateY.value = withTiming(0, animationConfig)
    },
  })

  return (
    <GestureDetector gesture={pan}>
      <Animated.View
        entering={FadeInUp.duration(300).easing(Easing.inOut(Easing.quad))}
      >
        <Animated.View
          className={tw(
            'bg-brand-white mx-8 rounded-r border-l-3 p-4 shadow',
            notificationAccentClassNames[notification.type ?? 'info']
          )}
          style={animatedStyle}
        >
          {notification.title ? (
            <ThemeText className="text-lg font-semibold">
              {notification.title}
            </ThemeText>
          ) : null}
          <ThemeText
            className={tw(
              'text-sm',
              notification.title && 'text-foreground-secondary'
            )}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {notification.message}
          </ThemeText>
        </Animated.View>
      </Animated.View>
    </GestureDetector>
  )
}

export function NotificationAnchor() {
  const height = useSatusBarHeight()
  const isSingleton = useIsSingletonComponent('NotificationAnchor')

  const current = useSyncExternalStore(
    notificationStore.subscribe,
    notificationStore.getSnapshot
  )

  if (!isSingleton) {
    console.warn('NotificationAnchor is mounted multiple times')
    return null
  }

  return (
    <View
      className="absolute inset-x-0 top-0 overflow-visible"
      pointerEvents="box-none"
      style={{ paddingTop: height }}
    >
      {current && (
        <NotificationCard
          key={current.id}
          notification={current}
        />
      )}
    </View>
  )
}
