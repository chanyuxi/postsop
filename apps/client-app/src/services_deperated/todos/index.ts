import { todos } from '@/data_deperated/todos'

import { requestLocalData } from '..'

/**
 * @deprecated do not use at future
 */
export function getTodos() {
  return requestLocalData(todos)
}
