// import { useNavigation } from '@react-navigation/native'
import { createContext, PropsWithChildren, useContext } from 'react'

import { unImplement } from '@/utils'

export interface AuthContextValue {
  isLoggedIn: boolean
  user: User | null
  login: () => void
  logout: () => void
}

export const AuthContext = createContext<AuthContextValue>({
  isLoggedIn: false,
  user: null,
  login: unImplement,
  logout: unImplement,
})

export function AuthProvider({ children }: PropsWithChildren) {
  // const { navigate } = useNavigation()

  const isLoggedIn = false

  const user: User = {
    id: 1,
    name: 'Seven Star',
    signature: 'Without action, dreams will always remain dreams',
  }

  const login = () => {}

  const logout = () => {}

  const value: AuthContextValue = {
    isLoggedIn,
    user,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
