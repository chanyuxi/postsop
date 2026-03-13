import { useRef } from 'react'
import {
  type GestureResponderEvent,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'

import {
  ContextMenu,
  type ContextMenuImperativeHandle,
} from '@/components/common/ContextMenu'
import { type Todo } from '@/types/todo'

import { TodoCard } from '../TodoCard'

export interface TodoListProps {
  todos: Todo[]
}

export function TodoList({ todos }: TodoListProps) {
  const contextMenuRef = useRef<ContextMenuImperativeHandle>(null)

  function popupContextMenu(event: GestureResponderEvent) {
    contextMenuRef.current?.show(event)
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {todos.map((todo) => (
          <TodoCard
            key={todo.id}
            todo={todo}
            onLongPress={popupContextMenu}
          />
        ))}
      </ScrollView>

      <ContextMenu ref={contextMenuRef}>
        <View style={styles.contextMenuContent}>
          <Text>Context Menu Item 1</Text>
          <Text>Context Menu Item 2</Text>
          <Text>Context Menu Item 3</Text>
        </View>
      </ContextMenu>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contextMenuContent: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
})
