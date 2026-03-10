import { type NativeStackScreenProps } from '@react-navigation/native-stack'
import { useEffect, useState } from 'react'

import { Button } from '@/components/common/Button'
import { ScreenWrapper } from '@/components/common/ScreenWrapper'
import { useAuth } from '@/hooks/useAuth'
import { type AllStackParamList } from '@/routes/type'
import { getTodos } from '@/services/todos'
import { type Todo } from '@/types/todo'

import { Calendar } from './components/Calendar'
import { TodoList } from './components/TodoList'

export function Home({}: NativeStackScreenProps<AllStackParamList>) {
  const [todos, setTodos] = useState<Todo[]>([])

  const { signOut } = useAuth()

  useEffect(() => {
    getTodos().then((data) => {
      setTodos(data)
    })
  }, [])

  return (
    <ScreenWrapper>
      <Calendar />

      {todos.length > 0 && <TodoList todos={todos} />}

      <Button onPress={signOut}>Sign Out</Button>
    </ScreenWrapper>
  )
}
