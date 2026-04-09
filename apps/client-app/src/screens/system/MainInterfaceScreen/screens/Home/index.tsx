import { useEffect, useState } from 'react'
import { View } from 'react-native'

import { Icons, TopBar } from '@/components/common'
import { ScreenWrapper } from '@/components/common/ScreenWrapper'
import { getTodos } from '@/services_deperated/todos'
import type { Todo } from '@/types/todo'

import { StatsPanel } from './components/StatsPanel'
import { TodoList } from './components/TodoList'

export function Home() {
  const [todos, setTodos] = useState<Todo[]>([])

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
        rightIcon={<Icons name="bell-outline" />}
        title="Todo"
      />

      <View className="flex-1 p-4">
        <StatsPanel />

        {todos.length > 0 && <TodoList todos={todos} />}
      </View>
    </ScreenWrapper>
  )
}
