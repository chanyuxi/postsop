import { type NativeStackScreenProps } from '@react-navigation/native-stack'
import { useEffect, useState } from 'react'
import { Button } from 'react-native'

import { BackgroundView } from '@/components/common/BackgroundView'
import { StackParamList } from '@/routes'
import { getTodos } from '@/services/todos'
import { Todo } from '@/types/todo'

import { Calendar } from './components/Calendar'
import { TodoList } from './components/TodoList'

type HomeProps = NativeStackScreenProps<StackParamList>

export function Home({ navigation }: HomeProps) {
  const [todos, setTodos] = useState<Todo[]>([])

  useEffect(() => {
    getTodos().then((data) => {
      setTodos(data)
    })
  }, [])

  return (
    <BackgroundView>
      <Calendar />

      {todos.length > 0 && <TodoList todos={todos} />}

      <Button
        title="Login"
        onPress={() => navigation.navigate('Login')}
      />
    </BackgroundView>
  )
}
