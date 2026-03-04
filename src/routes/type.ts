import { NavigatorScreenParams } from '@react-navigation/native'

export type AuthStackParamList = {
  Login: undefined
}

export type MainStackParamList = {
  MainInterface: NavigatorScreenParams<MainInterfaceTabParamList>
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
