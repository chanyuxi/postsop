import { type NavigatorScreenParams } from '@react-navigation/native'

export interface AuthStackParamList {
  SignIn: { initialEmail?: string } | undefined
  SignUp: undefined
}

export interface MainStackParamList {
  MainInterface: NavigatorScreenParams<MainInterfaceTabParamList>
  Setting: undefined
}

export interface MainInterfaceTabParamList {
  Home: undefined
  QuietMode: undefined
  Mine: undefined
}

export interface RootStackParamList {
  Auth: NavigatorScreenParams<AuthStackParamList>
  Main: NavigatorScreenParams<MainStackParamList>
}

export type AllStackParamList = RootStackParamList &
  AuthStackParamList &
  MainStackParamList &
  MainInterfaceTabParamList
