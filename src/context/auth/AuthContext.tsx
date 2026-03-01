import { createContext, useContext } from 'react'

export interface AuthContextData {
  isLoggedIn: boolean
  login: () => void
  logout: () => void
}

export const AuthContext = createContext<AuthContextData>({
  isLoggedIn: false,
  login: () => {},
  logout: () => {},
})

export const AuthProvider = AuthContext.Provider

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
