import { useFocusEffect } from '@react-navigation/native'
import { useCallback, useRef } from 'react'

export function useRefreshOnFocus(refetch: () => void) {
  const firstMount = useRef(true)

  useFocusEffect(
    useCallback(() => {
      if (firstMount.current) {
        firstMount.current = false
        return
      }
      refetch()
    }, [refetch])
  )
}
