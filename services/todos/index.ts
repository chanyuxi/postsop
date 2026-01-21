import { todos } from "@/data/todos"

import { requestLocalData } from ".."

export function getTodos() {
    return requestLocalData(todos)
}
