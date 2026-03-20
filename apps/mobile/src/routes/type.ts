import { type NavigatorScreenParams } from '@react-navigation/native'

export type AuthStackParamList = {
  SignIn: undefined
}

export type MainStackParamList = {
  MainInterface: NavigatorScreenParams<MainInterfaceTabParamList>
  Setting: undefined
}

export type MainInterfaceTabParamList = {
  Home: undefined
  QuietMode: undefined
  Mine: undefined
}

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>
  Main: NavigatorScreenParams<MainStackParamList>
}

export type AllStackParamList = RootStackParamList &
  AuthStackParamList &
  MainStackParamList &
  MainInterfaceTabParamList
