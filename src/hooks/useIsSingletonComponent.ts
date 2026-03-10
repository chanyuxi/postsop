import { useEffect, useId } from 'react'

const singletonIds = new Map<string, string>()

/**
 * Check if there is only one instance of the component in the app. Subsequent
 * calls to the same named component using this hook will return false, while
 * the first instance will return true
 */
export function useIsSingletonComponent(componentName: string) {
  const id = useId()

  useEffect(() => {
    if (!singletonIds.has(componentName)) {
      singletonIds.set(componentName, id)
    }

    return () => {
      if (singletonIds.has(componentName)) {
        singletonIds.delete(componentName)
      }
    }
  }, [id, componentName])

  return (
    !singletonIds.has(componentName) || singletonIds.get(componentName) === id
  )
}
