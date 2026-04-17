import { useRef } from 'react'
import type { GestureResponderEvent } from 'react-native'
import { ScrollView, StyleSheet, View } from 'react-native'

import type { ContextMenuImperativeHandle } from '@/components/common/ContextMenu'
import { ContextMenu } from '@/components/common/ContextMenu'
import { ThemeText } from '@/components/common/ThemeText'
import type { Todo } from '@/types/todo'

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
          <ThemeText>Context Menu Item 1</ThemeText>
          <ThemeText>Context Menu Item 2</ThemeText>
          <ThemeText>Context Menu Item 3</ThemeText>
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
