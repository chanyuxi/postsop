import { todos } from '@/data_deperated/todos'

import { requestLocalData } from '..'

/**
 * @deprecated
 */
export function getTodos() {
  return requestLocalData(todos)
}
