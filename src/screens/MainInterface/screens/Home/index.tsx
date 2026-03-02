import { useEffect, useState } from 'react'

import { BackgroundView } from '@/components/common/BackgroundView'
import { getTodos } from '@/services/todos'
import { Todo } from '@/types/todo'

import { Calendar } from './components/Calendar'
import { TodoList } from './components/TodoList'

export function Home() {
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
    </BackgroundView>
  )
}
