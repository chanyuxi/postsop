/* eslint-disable-next-line @eslint-community/eslint-comments/disable-enable-pair */
/* eslint-disable @typescript-eslint/consistent-type-definitions */

import type { NavigatorScreenParams } from '@react-navigation/native'

export type AuthStackParamList = {
  SignIn: { initialEmail?: string } | undefined
  SignUp: undefined
}

export type MainStackParamList = {
  MainTabs: NavigatorScreenParams<MainTabsParamList>
  SetupProfile: undefined
  Setting: undefined
}

export type MainTabsParamList = {
  Post: undefined
  QuietMode: undefined
  Account: undefined
}

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>
  Main: NavigatorScreenParams<MainStackParamList>
}

export type AllStackParamList = RootStackParamList &
  AuthStackParamList &
  MainStackParamList &
  MainTabsParamList
