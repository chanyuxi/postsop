import { useState } from 'react'
import { type GestureResponderEvent, Pressable, Text, View } from 'react-native'

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
      className="mb-4 rounded-lg bg-sky-100 p-4"
      onPress={toggleCollapse}
      onLongPress={onLongPress}
    >
      <Text>{todo.title}</Text>

      <Collapse collapsed={isCollapsed}>
        <View>
          <Text>Something about description</Text>
          <Text>Date: unknown</Text>
        </View>
      </Collapse>
    </Pressable>
  )
}
