import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons'
import { useEffect, useState } from 'react'
import { View } from 'react-native'
import { useCSSVariable } from 'uniwind'

import { TopBar } from '@/components/common'
import { ScreenWrapper } from '@/components/common/screen-wrapper'
import { getTodos } from '@/services-deperated/todos'
import type { Todo } from '@/types/todo'

import { StatsPanel } from './components/stats-panel'
import { TodoList } from './components/todo-list'

export function Home() {
  const [todos, setTodos] = useState<Todo[]>([])
  const foregroundColor = useCSSVariable('--color-foreground') as string

  useEffect(() => {
    getTodos()
      .then((data) => {
        setTodos(data)
      })
      .catch(() => {
        setTodos([])
      })
  }, [])

  return (
    <ScreenWrapper statusBarClassName="bg-background-secondary">
      <TopBar
        hideBackButton
        rightIcon={
          <MaterialDesignIcons
            color={foregroundColor}
            name="bell-outline"
          />
        }
        title="Todo"
      />

      <View className="flex-1 p-4">
        <StatsPanel />

        {todos.length > 0 && <TodoList todos={todos} />}
      </View>
    </ScreenWrapper>
  )
}
