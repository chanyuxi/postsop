import AsyncStorage from '@react-native-async-storage/async-storage'
import type { NavigationState } from '@react-navigation/native'
import { useEffect, useState } from 'react'
import { Linking } from 'react-native'

import { PERSISTENCE_KEY } from '@/constants/keys'

export function useNavigationPersistence() {
  const [isReady, setIsReady] = useState(__DEV__ ? false : true)
  const [initialState, setInitialState] = useState<NavigationState>()

  useEffect(() => {
    let isMounted = true

    const restoreState = async () => {
      const initialUrl = await Linking.getInitialURL()

      if (initialUrl == null) {
        let savedState: string | null = null

        try {
          savedState = await AsyncStorage.getItem(PERSISTENCE_KEY)
        } catch (error) {
          console.error('Failed to restore navigation state', error)
        }

        if (savedState) {
          try {
            const state = JSON.parse(savedState) as NavigationState

            if (isMounted) {
              setInitialState(state)
            }
          } catch (error) {
            console.error('Failed to parse navigation state', error)
          }
        }
      }

      if (isMounted) {
        setIsReady(true)
      }
    }

    void restoreState()

    return () => {
      isMounted = false
    }
  }, [])

  return {
    initialState,
    isReady,
    persistState: (state: NavigationState | undefined) =>
      AsyncStorage.setItem(PERSISTENCE_KEY, JSON.stringify(state)),
  }
}
