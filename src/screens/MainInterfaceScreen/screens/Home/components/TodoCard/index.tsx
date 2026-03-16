import { useState } from 'react'
import { type GestureResponderEvent, Pressable, View } from 'react-native'

import { ThemeText } from '@/components/common'
import { Collapse } from '@/components/common/Collapse'
import { type Todo } from '@/types/todo'

interface TodoCardProps {
  todo: Todo
  onLongPress?: (event: GestureResponderEvent) => void
}

export function TodoCard({ todo, onLongPress }: TodoCardProps) {
  const [isCollapsed, setIsCollapsed] = useState(true)

  function toggleCollapse() {
    setIsCollapsed(!isCollapsed)
  }

  return (
    <Pressable
      className="bg-background-secondary mb-4 rounded-lg p-4"
      onLongPress={onLongPress}
      onPress={toggleCollapse}
    >
      <ThemeText>{todo.title}</ThemeText>

      <Collapse collapsed={isCollapsed}>
        <View>
          <ThemeText>Something about description</ThemeText>
          <ThemeText>Date: unknown</ThemeText>
        </View>
      </Collapse>
    </Pressable>
  )
}
