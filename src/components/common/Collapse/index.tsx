import {
  type PropsWithChildren,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { Animated, type LayoutChangeEvent, View } from 'react-native'

/**
 * Props for the Collapse component
 */
export interface CollapseProps {
  /**
   * Whether the collapse component is in a collapsed state
   */
  collapsed: boolean
  /**
   * Duration of the collapse/expand animation in milliseconds
   * @default 300
   */
  duration?: number
  /**
   * Easing function for the collapse/expand animation
   * @param value - A number between 0 and 1 representing the animation progress
   * @returns The eased value
   */
  easing?: (value: number) => number
  /**
   * Callback function triggered when the collapse/expand animation completes
   */
  onAnimationEnd?: () => void
  /**
   * Whether to render children elements when the component is in collapsed state
   * @default false
   */
  renderChildrenWhenCollapsed?: boolean
}

export function Collapse({
  collapsed,
  children,
  duration = 200,
  easing,
  onAnimationEnd,
  renderChildrenWhenCollapsed,
}: PropsWithChildren<CollapseProps>) {
  // Store the current animation instance to allow stopping/interrupting
  const animation = useRef<Animated.CompositeAnimation | null>(null)
  // Animated value that drives the height changes
  const animatedHeight = useRef(new Animated.Value(0))

  // Track the measured height of content and whether measurement is complete
  const [contentHeight, setContentHeight] = useState(0)
  const [isMeasured, setIsMeasured] = useState(false)

  // Callback fired when the inner content layout changes
  // Measures the actual height and initializes animation if not collapsed
  const handleContentLayout = useCallback(
    (event: LayoutChangeEvent) => {
      const { height } = event.nativeEvent.layout

      if (height > 0 && height !== contentHeight) {
        setContentHeight(height)
        setIsMeasured(true)

        // If expanded, animate to the full height immediately
        if (!collapsed) {
          if (animation.current) {
            animation.current.stop()
          }

          Animated.timing(animatedHeight.current, {
            toValue: height,
            duration: 150,
            useNativeDriver: false,
          }).start(() => {
            onAnimationEnd?.()
          })
        }
      }
    },
    [collapsed, contentHeight, onAnimationEnd]
  )

  // Main animation effect: runs when collapsed state or content changes
  useEffect(() => {
    if (!isMeasured) {
      return
    }

    // Stop any ongoing animation before starting a new one
    if (animation.current) {
      animation.current.stop()
    }

    // Target height: 0 if collapsed, full height if expanded
    const toValue = collapsed ? 0 : contentHeight

    // Create and start the animation
    animation.current = Animated.timing(animatedHeight.current, {
      toValue,
      duration,
      easing,
      useNativeDriver: false,
    })

    animation.current.start(({ finished }) => {
      if (finished) {
        onAnimationEnd?.()
      }
      animation.current = null
    })

    // Cleanup: stop animation when component unmounts or dependencies change
    return () => {
      if (animation.current) {
        animation.current.stop()
      }
    }
  }, [collapsed, contentHeight, duration, easing, isMeasured, onAnimationEnd])

  // Reset measurements when children change
  useEffect(() => {
    if (!children) {
      setContentHeight(0)
      setIsMeasured(false)
    }
  }, [children])

  // Control visibility based on collapsed state and renderChildrenWhenCollapsed flag
  const styleOfOpacity = {
    opacity: renderChildrenWhenCollapsed || !collapsed ? 1 : 0,
  }

  return (
    <Animated.View
      className="overflow-hidden"
      // Fix: Cannot access refs during render
      // style={{ height: animatedHeight.current }}
    >
      <View
        className="absolute w-full"
        pointerEvents="none"
        style={styleOfOpacity}
        onLayout={handleContentLayout}
      >
        {children}
      </View>
    </Animated.View>
  )
}
