import {
  PropsWithChildren,
  type Ref,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import {
  Animated,
  Dimensions,
  type GestureResponderEvent,
  type LayoutChangeEvent,
  Modal,
  Pressable,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export interface ContextMenuImperativeHandle {
  show: (event: GestureResponderEvent) => void
  hide: () => void
}

export interface ContextMenuProps {
  ref?: Ref<ContextMenuImperativeHandle>
}

export function ContextMenu({
  children,
  ref,
}: PropsWithChildren<ContextMenuProps>) {
  const insets = useSafeAreaInsets()

  const [visible, setVisible] = useState(false)

  const [location, setLocation] = useState({ x: 0, y: 0 })
  const [menuSize, setMenuSize] = useState({ width: 0, height: 0 })

  const isMeasured = useRef(false)
  const savedEvent = useRef<GestureResponderEvent | null>(null)

  const { width: screenWidth, height: screenHeight } = Dimensions.get('window')

  const animatedValue = useRef(new Animated.Value(0))

  const setPosition = useCallback(
    (straightforwardMenuSize?: { width: number; height: number }) => {
      const { pageX, pageY } = savedEvent.current!.nativeEvent

      let x = pageX - insets.left
      let y = pageY - insets.top

      const { width, height } = straightforwardMenuSize || menuSize

      if (x + width + insets.left > screenWidth) {
        x = x - width
        if (x < 0) x = 0
      }
      if (y + height + insets.top > screenHeight) {
        y = y - height
        if (y < 0) y = 0
      }

      setLocation({ x, y })
      Animated.spring(animatedValue.current, {
        toValue: 1,
        useNativeDriver: true,
      }).start()
    },
    [menuSize, screenWidth, screenHeight, insets]
  )

  const measureContent = useCallback(
    (event: LayoutChangeEvent) => {
      const { width, height } = event.nativeEvent.layout

      setMenuSize({ width, height })

      if (!isMeasured.current) {
        isMeasured.current = true
        setPosition({ width, height })
      }
    },
    [setPosition]
  )

  const show = useCallback(
    (event: GestureResponderEvent) => {
      if (visible) {
        return
      }

      savedEvent.current = event
      setVisible(true)
      animatedValue.current.setValue(0)

      if (isMeasured.current) {
        setPosition()
      }
    },
    [visible, setPosition]
  )

  const hide = useCallback(() => {
    if (!visible) {
      return
    }

    setVisible(false)
  }, [visible])

  useImperativeHandle(ref, () => ({
    show,
    hide,
  }))

  const animatedTransformScale = animatedValue.current.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 1],
  })

  const combinedStyle = {
    top: location.y,
    left: location.x,
    transform: [{ scale: animatedTransformScale }],
  }

  return (
    <Modal
      visible={visible}
      transparent
    >
      <Pressable
        className="flex-1"
        onPress={hide}
      >
        <Animated.View
          className="absolute"
          style={combinedStyle}
          onLayout={measureContent}
        >
          {children}
        </Animated.View>
      </Pressable>
    </Modal>
  )
}
