import { type NativeStackScreenProps } from '@react-navigation/native-stack'
import { useEffect, useState } from 'react'
import { View } from 'react-native'

import { Icons, TopBar } from '@/components/common'
import { ScreenWrapper } from '@/components/common/ScreenWrapper'
import { type AllStackParamList } from '@/routes/type'
import { getTodos } from '@/services/todos'
import { type Todo } from '@/types/todo'

import { StatsPanel } from './components/StatsPanel'
import { TodoList } from './components/TodoList'

export function Home({}: NativeStackScreenProps<AllStackParamList>) {
  const [todos, setTodos] = useState<Todo[]>([])

  useEffect(() => {
    getTodos().then((data) => {
      setTodos(data)
    })
  }, [])

  return (
    <ScreenWrapper statusBarClassName="bg-background-secondary">
      <TopBar
        hideBackButton
        title="Todo"
        rightIcon={<Icons name="bell-outline" />}
      />

      <View className="flex-1 p-4">
        <StatsPanel />

        {todos.length > 0 && <TodoList todos={todos} />}
      </View>
    </ScreenWrapper>
  )
}
