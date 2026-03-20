import { createMMKV } from 'react-native-mmkv'

import { AUTHORIZATION_USER_TOKEN, STRORAGE_KEY_THEME } from '@/constants/keys'

export const StrorageKeys = {
  THEME: STRORAGE_KEY_THEME,
  TOKEN: AUTHORIZATION_USER_TOKEN,
}

export const storage = createMMKV()
